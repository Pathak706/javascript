const models = require('../models');
const express = require('express');
const transactionRouter = express.Router();
const apitransaction = require('../api/fundtransferapi');
const pushService = require('../sockets/sockets');


function postTransaction(req, res) {
  const {user_id, round_id, string, amount} = req.body;
  console.log("ROund ID", round_id);
  apitransaction.transaction(user_id, amount, round_id)
    .then(async response => {
      const {status, message} = response.data;
      console.log("Status", status);
      if (status) {
       let created;

       console.log("String", string);
        try {
         created =  await models.useradmin_tfr.create({
            user_id,
            round_id,
            string,
            amount
          });
        } catch (err) {
          return res.status(401).json({
            message: err.message
          });
        }

        if (created){
          pushService.pushMessage(io, { fund_transfer_result: {'user_id': user_id, 'round_id': round_id, 'string': string} });
          return res.status(201).json({
           message,
          });
        } else {
          return res.status(304).json({
            message: "Unable to insert new field"
          });
        }

      } else {
        return res.status(304).json({
          message
        });
      }
    })
    .catch(err => {
      console.log(err.message);
      res.status(500).json({
        message: err.message
      });
    });
}

transactionRouter.route('/fund_transfer')
  .post((req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized to view this"
      });
    }

    if (!req.body.user_id || !req.body.round_id || !req.body.string|| !req.body.amount) {
      return res.status(400).json({
        message: "Required parameters are not provided"
      });
    } else  {
      postTransaction(req, res);
    }
  })

module.exports = transactionRouter;

const models = require('../models');
const express = require('express');
const tableRouter = express.Router();
const userSettingService = require('../common/user_setting');



function postOperation(req, res) {

}

tableRouter.route('/tablereturn')
  .post((req, res) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized to view this"
      });
    }

    if (!req.body.user_id || !req.body.round_id || !req.body.amount) {
      return res.status(400).json({
        message: "Required parameters  are not provided"
      });
    } else {
      postOperation(req, res);
    }
  });

  tableRouter.route('/user_setting')
    .post((req, res) => {
      if (!req.user) {
        return res.status(401).json({
          message: "Unauthorized to view this"
        });
      }
      if (!req.body.user_id) {
        return res.status(400).json({
          message: "Required parameters  are not provided"
        });
      } else {
        userSettingService.getUserSetting(req, res, true);
      }
    });

    tableRouter.route('/user_setting_update')
      .post((req, res) => {
        if (!req.user) {
          return res.status(401).json({
            message: "Unauthorized to view this"
          });
        }
        if (!req.body.user_id || !req.body.payout_win) {
          return res.status(400).json({
            message: "Required parameters  are not provided"
          });
        } else {
          userSettingService.updateUserSetting(req, res, true);
        }
      });

module.exports = tableRouter;

const models = require('../models');
const pushService = require('../sockets/sockets');
const userSettingService = (function() {
  var connections = {};
  return {

    getUserSetting: function (req, res, apiCall) {
            const {user_id} = req.body;
                  try {
                    models.users_setting.find({
                      // attributes: ['string'],
                      where: {
                          user_id: user_id
                        }
                    }).then(async result=>{
                      const add_result = [];
                      if(apiCall){
                        return res.status(201).json({
                         data: result,
                         message: 'Successful'
                        });
                      }else{
                        io.sockets.emit('message', result);
                        return result;
                      }
                    });
                  } catch (err) {
                    return res.status(401).json({
                      message: err.message
                    });
                  }
        },
        updateUserSetting: function (req, res, apiCall) {
            console.log("chklo", req );
            const {user_id, payout_win} = req.body;
                  try {
                    const updated = models.users_setting.update({
                      payout_win:payout_win
                    }, {
                      where: {
                          user_id: user_id
                        }
                    }).then(async result=>{
                      const add_result = [];
                      if(apiCall){
                      return res.status(201).json({
                       message: 'Successful Updated'
                      });
                        }else{
                            return true;
                        }
                    });
                  } catch (err) {
                    return res.status(401).json({
                      message: err.message
                    });
                  }
        }
  }
}());

module.exports = userSettingService;

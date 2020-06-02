
const userSettingService = require('../common/user_setting');

const pushService = (function() {
  var connections = {};
  return {
    registerUser: function (userId) {
            if (connections[userId] == undefined) {
                connections[userId] = {}
            }

            connections[userId] = null;
            console.log('Registered connection '  + '*** for user ' + userId);
        },

        registerSocket: function (userId, socket) {
            if (connections[userId] != null) {
               console.log("Connection"); 

              socket.id = userId;
              console.log("Register socket for connection");
              
              //socket.userId = userId;
               // socket.connectionId = connectionId;
               // connections[userId][connectionId] = socket;
               // console.log('Registered socket for connection ' + connectionId.substring(0, 4) + '*** and  user ' + userId);
                return true;
            } else {
                console.log('Not found empty conn for connection ' + userId);
                return false;
            }
        },

        // removeConnection: function (socket) {
        //     var userId = socket.userId;
        //     if (userId && connnectionId && connections[userId] && connections[userId][connnectionId]) {
        //         console.log('Removed socket for user ' + userId + ' and connection: ' + connectionId.substring(0, 4) + '***');
        //         delete connections[socket.connectionId];
        //     }
        // },
        isAlreadyLogedIn: function(userId){
            console.log(connections[userId] !== undefined);
            if(connections[userId] !== undefined){
                return true;
            }else{
                return false;
            }
        },
        deleteUser: function(userid){
            //console.log("debugger",global.inout.sockets.sockets);
            console.log("connections", connections);
            delete connections[userid];
            //global.inout.sockets.emit('message', message);
        },
        pushMessage: function (io, message) {
          console.log("message:", message);
          io.sockets.emit('message', message);
        },

        recieveSocket: function (message) {
            if(message){
                if(message.action=='update_payout_win'){
                    userSettingService.updateUserSetting(
                        {   
                            body:{
                            user_id:message.user_id, payout_win:message.payout_win
                            }
                        }
                        );
                }
                if(message.action=='get_payout_win'){
                    userSettingService.getUserSetting(
                        {   
                            body:{
                            user_id:message.user_id
                            }
                        }
                        );
                }
            }
        }
  }
}());

module.exports = pushService;

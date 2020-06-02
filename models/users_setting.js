'user strict'

module.exports = (sequelize, DataTypes) => {

  var users_setting = sequelize.define('users_setting', {
    user_id: DataTypes.INTEGER,
    payout_win: DataTypes.STRING
  }, {
    timestamps: false,
    freezeTableName: true
  })

  users_setting.associate = function (models) {

  }
  return users_setting;
}

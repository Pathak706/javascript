'use strict'

module.exports = (sequelize, DataTypes) => {
 
  var useradmin_tfr = sequelize.define('useradmin_tfr', {
    user_id: DataTypes.INTEGER,
    round_id: DataTypes.STRING,
    string: DataTypes.STRING,
    amount: DataTypes.STRING
  }, {
    freezeTableName: true
  });


  useradmin_tfr.associate = function(models) {
  }

  return useradmin_tfr;
}

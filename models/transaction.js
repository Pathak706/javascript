'use strict'

module.exports = (sequelize, DataTypes) => {
  var transactions = sequelize.define('transactions', {
    user_id: DataTypes.INTEGER,
    trans_id: DataTypes.STRING,
    time: DataTypes.DATE,
    description: DataTypes.STRING,
    amount: DataTypes.STRING,
    new_balance: DataTypes.STRING,
    type: DataTypes.INTEGER,
    round_id: DataTypes.STRING,
    ball: DataTypes.INTEGER,
    earned: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    charge: DataTypes.STRING
  }, {
    timestamps: false,
    freezeTableName: true
  });

  transactions.associate = function(models) {
  }
  return  transactions;
}

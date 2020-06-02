'user strict'

module.exports = (sequelize, DataTypes) => {

  var current_game = sequelize.define('current_game', {
    roundid: DataTypes.STRING,
    number: DataTypes.INTEGER,
    custom_number: DataTypes.INTEGER,
    color: {
      type: DataTypes.ENUM,
      values: ['Red', 'Black', 'Green']
    },
    time: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    timestamps: false,
    freezeTableName: true
  })

  current_game.associate = function (models) {

  }
  return current_game;
}

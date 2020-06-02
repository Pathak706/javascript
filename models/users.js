"use strict";

module.exports = (sequelize, DataTypes) => {
  var users = sequelize.define(
    "users",
    {
      referrer_id: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      balance: DataTypes.STRING,
      join_date: DataTypes.DATE,
      status: DataTypes.INTEGER,
      paid_status: DataTypes.INTEGER,
      ver_status: DataTypes.INTEGER,
      ver_code: DataTypes.STRING,
      forget_code: DataTypes.STRING,
      birth_day: DataTypes.DATE,
      email: DataTypes.STRING,
      mobile: DataTypes.STRING,
      street_address: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      post_code: DataTypes.STRING,
      remember_token: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      tauth: DataTypes.INTEGER,
      tfver: DataTypes.INTEGER,
      emailv: DataTypes.INTEGER,
      smsv: DataTypes.INTEGER,
      vsent: DataTypes.STRING,
      secretcode: DataTypes.STRING,
      image: DataTypes.STRING,
      role: DataTypes.INTEGER,
      is_online: DataTypes.INTEGER,
    },
    {
      timestamps: false,
      freezeTableName: true,
    }
  );

  users.associate = function (models) {};

  return users;
};

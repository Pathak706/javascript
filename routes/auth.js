const models = require("../models");
const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require('moment');
require("dotenv").config({ path: ".variables.env" });
const pushService = require('../sockets/sockets');

// on server make user online
function makeUserOnline(username) {
  models.users
    .findOne({
      where: {
        username: username,
      },
    })
    .then(async (user) => {
      console.log(`update ${username} status online.`);
      await models.users.update(
        {
          is_online: 1,
        },
        {
          where: {
            username: username,
          },
        }
      );
    })
    .catch((err) => {
      console.log(`got error marking user online ${err.message}`);
    });
}

function makeUserOffline(username) {
  models.users
    .findOne({
      where: {
        username: username,
      },
    })
    .then(async (user) => {
      console.log(`update ${username} status offline.`);
      await models.users.update(
        {
          is_online: 0,
        },
        {
          where: {
            username: username,
          },
        }
      );
    })
    .catch((err) => {
      console.log(`got error marking user online ${err.message}`);
    });
}

function checkUserOnline(username) {
  models.users
    .findOne({
      where: {
        username: username,
        is_online: 1,
      },
    })
    .then(async (user) => {
      console.log(`user => ${username} already online.`);
      return true;
    })
    .catch((err) => {
      return false;
    });
}

function getCurrentUser(req, res) {
  const { username, password, action } = req.body;
  console.log("body => ", req.body);
  models.users
    .findOne({
      where: {
        username: username,
        role: 4,
        is_online: action == 'login' ? 0 : 1,
        status: 1
      },
    })
    .then(async (user) => {
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const transactions = await models.transactions.findAll({
          where: {
            user_id: user.id  
          },
          limit: 10,
          order: [['created_at', 'DESC']]
        });
        const games = await models.current_game.findAll({
          limit: 8,
          order: [['created_at', 'DESC']]
        });
        const { username, password } = user;
        const token = jwt.sign({ username, password }, process.env.SECRET);
        makeUserOnline(username);
        return res.status(200).json({
          message: "Login successful",
          user,
          transactions,
          last7games: games,
          token,
          current_time: moment().local().format("YYYY-MM-DD HH:mm:ss")
        });
      } else {
        throw new Error("Password does not match");
      }
    })
    .catch((err) => {
      console.log("Exception", err.message);
      res.status(401).json({
        message: "User is already login.",
      });
    });
}

function logoutCurrentUser(req, res) {
  const username = req.body.username;
  const toLobby = req.body.toLobby;
  console.log("logout", req.body);
  if(toLobby != "False") {
    makeUserOffline(username);
    pushService.deleteUser(username);
  }
  return res.status(200).json({
    message: "User Logged out",
  });
}

function loginUserForLobby(req, res) {
  const { username, password } = req.body;
  models.users
    .findOne({
      where: {
        username: username,
        role: 4,
        status: 1
      },
    })
    .then(async (user) => {
      const match = bcrypt.compareSync(password, user.password);
      if (match) {
        const { email, password } = user;
        const token = jwt.sign({ email, password }, process.env.SECRET);
        if (req.body.action !== "relogin" && checkUserOnline(username)) {
          throw new Error("User Already Logged In");
        } else {
          makeUserOnline(username);
          pushService.registerUser(user.username, email);
          return res.status(200).json({
            message: "Login successful",
            user,
            token,
            current_time: moment().format("YYYY-MM-DD HH:mm:ss")
          });
        }
      } else {
        throw new Error("Password does not match");
      }
    })
    .catch((err) => {
      console.log("Exception", err.message);
      res.status(401).json({
        message: "Please contact admin.",
      });
    });
}

authRouter.route("/auth").post((req, res) => {
  if (req.body.action == "login" || req.body.action == "relogin") {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Required fields are not entered",
      });
    }
    getCurrentUser(req, res);
  } else if (req.body.action == "logout") {
    console.log("Username", req.body.username);
    logoutCurrentUser(req, res);
  }
});

authRouter.route("/login").post((req, res) => {
  if (req.body.action == "login" || req.body.action == "relogin") {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message: "Required fields are not entered",
      });
    }
    loginUserForLobby(req, res);
  }
});

authRouter.route("/version").post((req, res) => {
  return res.status(200).json({
    version: "5.0",
  });
});

authRouter.route("/changepassword").post((req, res) => {
  if (!req.body.userid || !req.body.newpass) {
    return res.status(400).json({
      message: "Required fields are not entered",
    });
  } else {
    try {
      const hash = bcrypt.hashSync(req.body.newpass, bcrypt.genSaltSync(10));

      const updated = models.users
        .update(
          {
            password: hash,
          },
          {
            where: {
              username: req.body.userid,
            },
          }
        )
        .then(async (result) => {
          return res.status(201).json({
            message: "Successful Updated",
          });
        });
    } catch (err) {
      return res.status(401).json({
        message: err.message,
      });
    }
  }
});

module.exports = authRouter;

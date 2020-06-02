const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
require('dotenv').config({path: '.variables.env'});
const jwt = require('jsonwebtoken');
const pushService = require('./sockets/sockets');



app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static('public'));

//place for route
app.use(require('./routes/auth.js'));

//custom middleware

app.use((err, req, res, next) => { 
  console.log(err);
  res.status(400).json({
    message: err
  });
});


app.use(async(req, res, next) => {
  const token = req.headers['authorization'];
  if (token !== null) {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.user = currentUser;
      console.log("current user on fetch");
    } catch (err) {
      console.log(err);
    }
  }
  next();
});


app.use(require('./routes'));




module.exports = app;
//place for authehnticated routes;

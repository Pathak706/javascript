const axios = require('axios');
require('dotenv').config({'path': '.variables.env'});

const axiosInstance = axios.create({
  baseURL: process.env.HOSTNAME,
  timeout:20000,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});


module.exports = axiosInstance;

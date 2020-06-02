const axios = require('./interceptor');

const route = '/api/fund_transfer_data'


module.exports = {
  transaction (user_id, amount, round_id) {
    console.log("Data Check", user_id, amount, round_id);
    return axios.post(route, {
      user_id,
      amount,
      round_id
    });
  }
};

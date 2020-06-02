const express = require('express');
const indexRouter = express.Router();

indexRouter.use('/transaction', require('./transaction'));
indexRouter.use('/table', require('./table'));


module.exports = indexRouter;

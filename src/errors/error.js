const { Sequelize } = require('sequelize');
const { StatusCodes } = require('http-status-codes')
const config = require('../config/environment')
const logger = require('../log/logger')
const ApiError = require('./ApiError')

const errorConverter = (err, _req, _ree, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof Sequelize ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || `${StatusCodes[statusCode]}`;
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

const errorHandler = (err, _req, res, _next) => {
  let { statusCode, message } = err;
  if (config.env === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Internal Server Error';
  }

  res.locals['errorMessage'] = err.message;

  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }),
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};


module.exports = {errorConverter, errorHandler}
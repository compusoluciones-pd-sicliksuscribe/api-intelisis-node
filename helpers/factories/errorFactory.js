const CustomError = require('./customError');

module.exports = (message = '', statusCode = 400, name = 'Error', errorCode = 7) => {
  throw new CustomError(name, message, statusCode, errorCode);
};

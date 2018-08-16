module.exports = function customError(name, message, statusCode, errorCode) {
  Error.captureStackTrace(this, this.constructor);
  this.name = name;
  this.message = message;
  this.statusCode = statusCode;
  this.errorCode = errorCode;
};

require('util').inherits(module.exports, Error);

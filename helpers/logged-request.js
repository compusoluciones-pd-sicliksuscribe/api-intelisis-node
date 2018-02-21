const request = require('request');
const requestPromise = require('request-promise');
const logger = require('./logger').debugLogger;
const requestDebug = require('request-debug');

const logRequest = (type, requestData) => {
  logger.info('Did a request with type %s', type);
  logger.info('Request data: %j', requestData);
};

requestDebug(request, logRequest);
requestDebug(requestPromise, logRequest);

module.exports = {
  request,
  requestPromise,
};

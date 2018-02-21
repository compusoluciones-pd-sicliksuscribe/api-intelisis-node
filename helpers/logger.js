const winston = require('winston');
const expressWinston = require('express-winston-2');
const debugLogger = new (winston.Logger)();


const configureExpressWinston = () => {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');
  expressWinston.bodyBlacklist.push('Contrasena', 'StoredContrasena');
};

const consoleDebugOptions = {
  timestamp: () => new Date().toLocaleString(),
  level: 'debug',
  name: 'debug-console',
  colorize: true,
  json: false,
};

const consoleInfoOptions = {
  timestamp: () => new Date().toLocaleString(),
  level: 'info',
  name: 'info-console',
  colorize: true,
  json: false,
};

const addDebugConsole = () => {
  debugLogger.add(winston.transports.Console, consoleDebugOptions);
};

const addInfoConsole = () => {
  debugLogger.add(winston.transports.Console, consoleInfoOptions);
};

const confgureWinstonTransports = () => {
  winston.remove(winston.transports.Console);
  if (process.env.DEV === '1') addDebugConsole();
  else addInfoConsole();
};

const loggerExpressWinston = {
  winstonInstance: winston,
  level: 'info',
  msg: 'HTTP {{req.method}} {{req.url}} ',
  // expressFormat: true,
  colorStatus: true,
};

const loggerExpressDebugWinston = {
  winstonInstance: debugLogger,
  level: 'info',
  expressFormat: true,
  colorStatus: true,
  meta: false,
};

confgureWinstonTransports();
configureExpressWinston();
module.exports = {
  expressLogger: expressWinston.logger(loggerExpressWinston),
  debugLogger,
  expressConsoleLogger: expressWinston.logger(loggerExpressDebugWinston),
};

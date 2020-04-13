'use strict';
const dotenv = require('dotenv');
const argv = require('minimist')(process.argv.slice(2));
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const loadEnvVariables = () => {
  switch (argv.env) {
    case 'development': dotenv.config({ path: './configs/.envDev' });
      break;
    case 'staging': dotenv.config({ path: './configs/.env.staging' });
      break;
    case 'production': dotenv.config({ path: './configs/.envProd' });
      break;
    default: throw 'Error al cargar el tipo de entorno';
  }
};

if (process.env.PRODUCTION === 1 || process.env.PRODUCTION === '1') {
  dotenv.config({ path: './configs/.envProd' });
} else if (argv.env) loadEnvVariables();
else dotenv.config({ path: './configs/.envDev' });

const Jobs = require('./models/jobs');
const jobs = require('./application/jobs');
const expressLogger = require('./helpers/logger').expressLogger;
const expressConsoleLogger = require('./helpers/logger').expressConsoleLogger;
const logger = require('./helpers/logger').debugLogger;
const config = require('./config');

// url enconded y el parser con el formato json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLogger);
app.use(expressConsoleLogger);
// Inicializador de Jobs
// jobs.start();
// configuración de la API general
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', config.AccessControlAllowOrigin);
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, token');
  // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  // Pass to next layer of middleware
  next();
});

// Unica ruta "ERP"
const routeERP = require('./routes/ERP');
app.use('/', routeERP);

const billing = require('./api-routes/billing');
app.use('/', billing);
const products = require('./api-routes/products');
app.use('/', products);

const exchangeRates = require('./api-routes/exchange-rates');
app.use('/exchange-rates', exchangeRates);

const clientsBalance = require('./api-routes/clients-balance');
app.use('/', clientsBalance);

const prepaidOrderBalance = require('./api-routes/bill-prepaids');
app.use('/', prepaidOrderBalance);

const updatePaidOrders = require('./api-routes/orders');
app.use('/', updatePaidOrders);

// Puerto que corre la API
const port = process.env.PORT || 8088;
app.listen(port);

logger.info(`api-clicksuscribe running ${port}`);
logger.info('environment:', process.env.ENVIRONMENT);

module.exports = app;

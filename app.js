'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const Jobs = require('./models/jobs');
const expressLogger = require('./helpers/logger').expressLogger;
const expressConsoleLogger = require('./helpers/logger').expressConsoleLogger;
const logger = require('./helpers/logger').debugLogger;
const dotenv = require('dotenv');

const loadEnvVariables = () => {
  const result = dotenv.config({ path: './configs/.envDev' });
  if (result.error) throw new Error(result.error);
};

if (!(process.env.PRODUCTION || process.env.STAGING)) {
  loadEnvVariables();
}

// url enconded y el parser con el formato json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressLogger);
app.use(expressConsoleLogger);
// Inicializador de Jobs
Jobs.start();
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

const enterprises = require('./api-routes/enterprises');
app.use('/enterprises', enterprises);

// Puerto que corre la API
const port = process.env.PORT || 8088;
app.listen(port);

logger.info('intelisis-api running local @ http://localhost:' + port);

module.exports = app;

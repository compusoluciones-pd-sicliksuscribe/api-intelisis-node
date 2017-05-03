'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config');
const Jobs = require('./models/jobs');

// url enconded y el parser con el formato json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Inicializador de Jobs
//Jobs.start();
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

// Puerto que corre la API
const port = process.env.PORT || 8081;
app.listen(port);

console.log('intelisis-api running local @ http://localhost:' + port);

module.exports = app;

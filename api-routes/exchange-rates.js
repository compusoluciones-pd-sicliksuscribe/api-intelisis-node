const express = require('express');
const router = express.Router();

const exchangeRatesSyncronizer = require('../application/syncronize-exchange-rates')();

router.put('/syncronization', (req, res) => {
  exchangeRatesSyncronizer.syncronizeExchangeRates()
    .then(response => res.send(response))
    .catch(error => res.send(error));
});

router.get('/', (req, res) => {
  exchangeRatesSyncronizer.getLatestExchangeRates()
  .then(response =>  res.send(response))
  .catch(error => res.send(error));
});

module.exports = router;

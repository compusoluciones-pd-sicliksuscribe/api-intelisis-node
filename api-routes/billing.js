const express = require('express');
const router = express.Router();

const billing = require('../application/billing');

router.put('/bill-all', (req, res) => {
  billing.billOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/microsoft', (req, res) => {
  billing.billMsOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/aws', (req, res) => {
  billing.billAWSOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;

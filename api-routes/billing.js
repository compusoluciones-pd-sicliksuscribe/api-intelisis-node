const express = require('express');
const router = express.Router();

const billing = require('../application/billing');

router.put('/bill-all', (req, res) => {
  billing.billOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/microsoft/:limit', (req, res) => {
  billing.billMsOrders(req.params)
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/aws', (req, res) => {
  billing.billAWSOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/azure-plan', (req, res) => {
  billing.billAzurePlanOrders()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.put('/bill-all/microsoftNCE/:limit', (req, res) => {
  billing.billMsOrders(req.params)
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;

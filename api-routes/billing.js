const express = require('express');
const router = express.Router();

const billing = require('../application/billing');
const bills = require('../application/bills');
const billDetails = require('../application/bill-detail');

router.put('/bill-all', (req, res) => {
  billing.createBilling.billAll()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.post('/bill', (req, res) => {
  bills.createBill(req.body)
  .then(result => res.send(result))
  .catch(err => res.send(err));
});

router.post('/bill-details', (req, res) => {
  billDetails.createBillDetails(req.body)
  .then(result => res.send(result))
  .catch(err => res.send(err));
});

module.exports = router;

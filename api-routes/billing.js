const express = require('express');
const router = express.Router();

const billing = require('../application/billing');

router.put('/bill-all', (req, res) => {
  billing.createBilling.billAll()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;

const express = require('express');
const router = express.Router();

const applyOrderPrepaid = require('../application/bill-prepaids');

router.post('/bill-prepaids', (req, res) => {
  applyOrderPrepaid.billPrepaids(req.body)
    .then(response => res.send(response))
    .catch(error => res.send(error));
});

module.exports = router;

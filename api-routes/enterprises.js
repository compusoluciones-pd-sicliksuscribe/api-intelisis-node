const express = require('express');
const router = express.Router();

const enterprises = require('../application/enterprises');

router.get('/get-available-credit/:enterpriseId', (req, res) => {
  enterprises.getAvailableCredit(req.params.enterpriseId)
  .then(response => res.send(response))
  .catch(error => res.send(error));
});

module.exports = router;

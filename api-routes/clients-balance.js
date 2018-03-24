const express = require('express');
const router = express.Router();

const getBalancePrepaid = require('../application/clients');

router.put('/clients-balance/:id', (req, res) => {
  getBalancePrepaid.clients(req.params)
    .then(response => res.send(response))
    .catch(error => res.send(error));
});

module.exports = router;

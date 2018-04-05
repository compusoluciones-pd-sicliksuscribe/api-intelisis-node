const express = require('express');
const router = express.Router();

const getBalancePrepaid = require('../application/clients');
// const test = require('../application/prepaid');

router.put('/clients-balance/:id', (req, res) => {
  getBalancePrepaid.clients(req.params)
    .then(response => res.send(response))
    .catch(error => res.send(error));
});

// router.put('/clients-balance', (req, res) => {
//   test.getPrepaid()
//     .then(response => res.send(response))
//     .catch(error => res.send(error));
// });

module.exports = router;

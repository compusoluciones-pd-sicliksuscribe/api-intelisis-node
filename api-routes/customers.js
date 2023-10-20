const express = require('express');
const router = express.Router();
const customers = require('../models/distribuidores');

router.put('/updateCustomers', (request, result) => {
  customers.obtener()
    .then(res => result.send(res))
    .catch(error => result.send(error));
});

module.exports = router;

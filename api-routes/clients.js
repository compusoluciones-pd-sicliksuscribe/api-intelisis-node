const express = require('express');
const router = express.Router();

const clients = require('../application/clients');

router.put('/actualizar-clientes', (req, res) => {
  clients.actualizar()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;

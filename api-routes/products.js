const express = require('express');
const router = express.Router();

const products = require('../models/productos');

router.put('/products', (req, res) => {
  products.obtener()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

module.exports = router;


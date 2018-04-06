const express = require('express');
const router = express.Router();

const products = require('../models/productos');
const version2Products = require('../application/products');

router.put('/products', (req, res) => {
  products.obtener()
    .then(result => res.send(result))
    .catch(err => res.send(err));
});

router.get('/product/:sku', (req, res) => {
  version2Products.getProductById(req.params.sku)
  .then(result => res.send(result))
  .catch(err => res.send(err));
});

router.get('/products/:idfabricante', (req, res) => {
  version2Products.getProducts(req.params.idfabricante)
  .then(result => res.send(result))
  .catch(err => res.send(err));
});

module.exports = router;


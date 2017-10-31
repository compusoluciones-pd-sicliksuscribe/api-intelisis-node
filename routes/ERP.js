'use strict';

const express = require('express');
const router = express.Router();
const ERP = require('../models/ERP');
const credito = require('../models/credito');

/*
https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#comments
*/

/*
* @namespace Actualizar
* @desc Ruta que manda llamar a todas las funciones del ERP para ser actualizado con el MarketPlace
* @param N/A
* @returns {Result}
* @memberOf ERP
*/

router.get('/Actualizar', (request, response) => {
  ERP.actualizar()
    .catch((error) => { response.send(error); })
    .done((result) => { response.send(result); });
});

/*
* @namespace Credito
* @desc Ruta que actualiza el crédito de un distribuidor en el ERP
* @param Cliente, Credito
* @returns {Result}
* @memberOf ERP
*/

router.post('/Credito', (request, response) => {
  credito.actualizarCredito(request.body.Cliente, request.body.Credito)
    .catch(error => response.send(error))
    .done(result => response.send(result));
});


module.exports = router;

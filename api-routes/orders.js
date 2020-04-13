const express = require('express');
const router = express.Router();

const orders = require('../application/orders');

/**
* @api {put} //update-paid-orders Actualizar pedidos a pagados.
* @apiName Orders
* @apiDescription Permite obtener los pedidos pagados desde intelisis y actualizar los pedidos del lado de click.
* @apiGroup Orders
*
*
* @apiSuccessExample Ejemplo de Respuesta:
    {
        "success": 1,
        "message": "Información actualizada.",
        "data": {
            "fieldCount": 0,
            "affectedRows": 1,
            "insertId": 0,
            "serverStatus": 2,
            "warningCount": 0,
            "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
            "protocol41": true,
            "changedRows": 1
        }
    }
*/

router.put('/update-paid-orders', (req, res) => {
  orders.updateOrderStatus()
  .then(result => res.send(result))
    .catch(err => res.send(err));
});


router.post('/get-data-pdf/:IdOrder', (req, res) => {
  orders.getDataPDFOrder(req.params)
      .then(result => res.send(result))
      .catch(err => res.send(err));
});
module.exports = router;


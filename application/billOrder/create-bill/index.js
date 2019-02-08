const auxiliariesFactory = require('./auxiliaries');
const {
    bill,
  prepareObject,
} = auxiliariesFactory();

const billOrder = IdPedido => prepareObject(IdPedido)
    .then(bill);

module.exports = billOrder;

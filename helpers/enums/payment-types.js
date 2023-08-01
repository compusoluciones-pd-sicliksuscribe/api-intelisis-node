const paymentTypes = {
  CREDIT: null,
  CASH: 'CONTADO',
  TRANSFER: 'Transferencia Electrónica de Fondos',
  CREDIT_CARD: 'Tarjeta de Crédito',
  DEBIT_CARD: 'Tarjeta de Débito',
  PAYPAL: 'Dinero electrónico',
  SPEI: 'Transferencia Electrónica de Fondos',
};

module.exports = Object.freeze(paymentTypes);


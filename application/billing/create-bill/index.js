const Auxiliaries = require('./auxiliaries');
const validation = require('./validation');

class CreateBilling {
  constructor(billingData, ordersData, intelisis) {
    this.billingData = billingData;
    this.auxiliaries = new Auxiliaries(ordersData, intelisis, billingData);
  }

  billAll() {
    return this.billingData.selectPendingOrdersToBill()
    .then(hola => { console.log('selectPendingOrderToBill', hola); return hola; })
      .then(validation.validatePendingBills)
      .then(validOrdersToBill => this.auxiliaries.bill(validOrdersToBill))
      .then(billingResult => Promise.resolve(billingResult));
  }
}

module.exports = CreateBilling;

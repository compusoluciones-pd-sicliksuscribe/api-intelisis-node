const help = require('../../../helpers/help');
const Auxiliaries = require('./auxiliaries');
const validation = require('./validation');

class CreateBilling {
  constructor(billingData, ordersData, intelisis) {
    this.billingData = billingData;
    this.auxiliaries = new Auxiliaries(ordersData, intelisis);
  }

  billAll() {
    return this.billingData.selectPendingOrdersToBill()
      .then(validation.validatePendingBills)
      .then(validOrdersToBill => this.auxiliaries.bill(validOrdersToBill))
      .then(billingResult => Promise.resolve(billingResult));
  }
}

module.exports = CreateBilling;

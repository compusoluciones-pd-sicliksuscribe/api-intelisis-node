const CreateBilling = require('./create-bill');
const billingData = require('../../data/billing');
const ordersData = require('../../data/orders');
const intelisis = require('../intelisis');

const createBilling = new CreateBilling(billingData, ordersData, intelisis);

module.exports = {
  createBilling,
};

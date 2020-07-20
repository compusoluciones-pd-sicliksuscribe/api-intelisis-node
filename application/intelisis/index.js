const createSale = require('./create-sale');
const createSaleAWS = require('./create-sale-aws');
const getSale = require('./get-reference');
const insertOrderDetail = require('./create-sale-detail');
const createRP = require('./create-rp');

module.exports = {
  createSale,
  createSaleAWS,
  getSale,
  insertOrderDetail,
  createRP,
};

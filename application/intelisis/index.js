const createSale = require('./create-sale');
const getSale = require('./get-reference');
const insertOrderDetail = require('./create-sale-detail');
const createRP = require('./create-rp');
const insertBillLog = require('./insert-bill-log');

module.exports = {
  createSale,
  getSale,
  insertOrderDetail,
  createRP,
  insertBillLog,
};

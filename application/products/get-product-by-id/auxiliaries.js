const products = require('../../../newData/products');

const getProduct = async(sku) => (
  products.getProductId(sku)
);

module.exports = () => ({ getProduct });

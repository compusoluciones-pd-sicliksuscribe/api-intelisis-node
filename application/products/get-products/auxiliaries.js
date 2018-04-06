const products = require('../../../newData/products');

const getAllProducts = async(idFabricante) => (
  products.getProducts(idFabricante)
);

module.exports = () => ({ getAllProducts });

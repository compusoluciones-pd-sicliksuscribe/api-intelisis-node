const { getAllProducts } = require('./auxiliaries')();

const getProducts = async(idFabricante) => (
  getAllProducts(idFabricante)
);

module.exports = getProducts;

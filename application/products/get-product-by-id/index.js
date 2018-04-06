const { getProduct } = require('./auxiliaries')();

const getProductById = async(sku) => {
  console.log(sku);
  const id = await getProduct(sku);
  console.log(id);
  return { productId: id };
};

module.exports = getProductById;

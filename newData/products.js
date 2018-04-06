const gateway = require('../helpers/gateway')();

const products = {};
const productsTableName = 'products';

products.getProductId = sku => (
  gateway.select(productsTableName, ['id'], { erp_id: sku })
  .then(rows => (rows[0] ? rows[0].id : false))
);

products.getProducts = (idFabricante) => (
  gateway.select(productsTableName, ['*'], { active: 1, product_maker_id: idFabricante })
);

module.exports = products;

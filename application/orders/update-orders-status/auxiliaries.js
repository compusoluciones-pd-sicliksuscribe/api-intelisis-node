const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');
const ordersData = require('../../../data/orders');
const defaults = {
  orders: ordersData,
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { orders } = dependencies;
  const { updatePaidOrders } = orders;
  const auxiliaries = { };

  const options = {
    method: 'GET',
    uri: config.ApiErp + 'Venta',
    headers: {
      token: config.TokenERP,
    },
  };

  auxiliaries.updateOrders = ordersPaid => Promise.all(ordersPaid.map(updatePaidOrders));

  auxiliaries.selectPaidOrders = () => requestPromise(options).then(result => JSON.parse(result));

  return auxiliaries;
};

module.exports = auxiliariesFactory;

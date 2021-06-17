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

  auxiliaries.paidOrders = async ordersPending => {
    const billComplete = await requestPromise(options).then(result => JSON.parse(result));
    ordersPending.map(async item => {
      const validate = await billComplete.find(element => element.ID === item.IdFactura);
      if (validate) { updatePaidOrders(item.IdFactura); }
    });
    return 'Ordenes actualizadas';
  };

  auxiliaries.pendingPay = () => orders.getPendingPayBill();

  return auxiliaries;
};

module.exports = auxiliariesFactory;

const intelisis = require('../../intelisis');
const billing = require('../../../data/billing');
const orders = require('../../../data/orders');

const auxiliariesFactory = () => {
  const auxiliaries = { };

  const validateCommission = orderDetails => {
    const products = orderDetails.data.filter(details => details.IdProducto !== 74);
    const commission = orderDetails.data.filter(details => details.IdProducto === 74)[0];
    const totalWithoutCommission = products.reduce((totalPrice, currentProduct) => totalPrice + currentProduct.Precio, 0);
    if (totalWithoutCommission > 0 && commission) products.push(commission);
    return products;
  };

  const insertOrderDetails = orderDetails => Promise.all(orderDetails.map(async (detail, index) => {
    detail.RenglonID = index + 1;
    detail.Renglon = (index + 1) * 2048;
    return intelisis.insertOrderDetail(detail)
      .then(res => JSON.parse(res));
  }));

  const orderDetails = async (ID, referencia) => billing.selectPendingOrderDetail(ID, referencia)
        .then(validateCommission)
        .then(insertOrderDetails)
        .then(orders.patch({ Facturado: 1, IdFactura: ID }, referencia));


  const verifyIfBillExist = order => intelisis.getSale(order);


  auxiliaries.updateDatails = pendingOrders =>
    Promise.all(pendingOrders.map(async order => {
      const billExist = await verifyIfBillExist(order);
      const response = JSON.parse(billExist);
      return response.length > 0 ? orderDetails(response[0].ID, response[0].Referencia) : `Pedido ${order} sin movimiento`;
    }));

  return auxiliaries;
};

module.exports = auxiliariesFactory;

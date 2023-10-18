const billingData = require('../../../data/billing');
const intelisis = require('../../intelisis');
const ordersData = require('../../../data/orders');
const createInvoice = require('../../intelisis/create-invoice');
const { sendNotificationErrorInsertOrder } = require('../../emails/');
const { insertActualBill } = require('../../../data/billing');
const { MICROSOFT } = require('../../../helpers/enums/makers');
const { ANNUAL_MONTHLY } = require('../../../helpers/enums/renewal-schema-types');

const defaults = {
  billing: billingData,
  orders: ordersData,
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, orders } = dependencies;
  const {
    selectPendingOrdersToBill, selectPendingOrderDetail,
  } = billing;

  const { patch } = orders;

  const auxiliaries = { };
  auxiliaries.selectPendingOrders = () => selectPendingOrdersToBill();

  const validateCommission = orderDetails => {
    const products = orderDetails.data.filter(details => details.IdProducto !== 74);
    const commission = orderDetails.data.filter(details => details.IdProducto === 74)[0];
    const totalWithoutCommission = products.reduce((totalPrice, currentProduct) => totalPrice + currentProduct.Precio, 0);
    if (totalWithoutCommission > 0 && commission) products.push(commission);
    return products;
  };

  const verifyIfBillExist = order => intelisis.getSale(order.IdPedido);

  const updateOrder = (billID, orderID) => patch({ Facturado: 1, IdFactura: billID }, orderID);

  const billOrder = async order =>
       selectPendingOrderDetail(order.IdPedido)
        .then(validateCommission)
        .then(details => createInvoice(order, details))
        .then(invoiceStatus => {
          if (invoiceStatus.content.success.success === 1) {
            if (order.IdEsquemaRenovacion === ANNUAL_MONTHLY && order.IdFabricante === MICROSOFT) insertActualBill(order.IdPedido, order.IdPedido, order.EsquemaRenovacion, order.FechaInicio, order.FechaFin);
            return updateOrder(invoiceStatus.content.success.data.id, order.IdPedido);
          }
          return sendNotificationErrorInsertOrder(order, invoiceStatus.content.success.message);
        });

  auxiliaries.billOrders = ({ data }) =>
    Promise.all(data.map(async order => {
      const billExist = await verifyIfBillExist(order);
      const response = JSON.parse(billExist);
      return response.length > 0 ? updateOrder(response[0].ID, order.IdPedido) : billOrder(order);
    }));

  return auxiliaries;
};

module.exports = auxiliariesFactory;

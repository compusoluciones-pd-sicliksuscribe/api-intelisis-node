const billingData = require('../../../data/billing');
const orders = require('../../../data/orders');
const intelisisData = require('../../intelisis');
const throwCustomError = require('../../../helpers/factories/errorFactory');

const defaults = {
  billing: billingData,
  intelisis: intelisisData,
  ordersData: orders,

};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, intelisis, ordersData } = dependencies;
  const { getBillData, selectPendingOrderDetail } = billing;
  const { getSale, createSale, insertOrderDetail } = intelisis;
  const { patch } = ordersData;

  const updateSalesId = (ID, IdPedido) => patch({ Facturado: 1, IdFactura: ID }, IdPedido);

  const insertIntelisis = orderToBill => createSale(orderToBill)
      .then(bill => {
        const parsedBill = JSON.parse(bill);
        if (parsedBill.length > 0) {
          return selectPendingOrderDetail(parsedBill[0].ID, parsedBill[0].IdPedidoMarketPlace)
            .then(result => insertOrderDetail(result.data[0]))
            .then(patch({ Facturado: 1, IdFactura: parsedBill[0].ID }, parsedBill[0].IdPedidoMarketPlace));
        }
        return throwCustomError('No se pudo facturar');
      });

  const updateOrder = (orderData, existSale) => {
    return updateSalesId(existSale[0].ID, orderData.IdPedido);
  };

  const auxiliaries = {};

  auxiliaries.prepareObject = async IdPedido => {
    const orderBillData = await getBillData(IdPedido);
    return orderBillData.data.length ? orderBillData.data[0] : throwCustomError('No se encontraron datos');
  };

  auxiliaries.bill = async orderData => {
    const existSale = await getSale(orderData.IdPedido);
    const resultSale = JSON.parse(existSale);
    return resultSale.length ? updateOrder(orderData, resultSale) : insertIntelisis(orderData);
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;


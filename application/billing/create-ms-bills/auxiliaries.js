const { groupBy } = require('ramda');
const moment = require('moment');
const throwCustomError = require('../../../helpers/factories/errorFactory');
const billingData = require('../../../data/billing');
const ordersData = require('../../../data/orders');
const { ON_DEMAND } = require('../../../helpers/enums/product-types');
const { MICROSOFT } = require('../../../helpers/enums/makers');
const { sendNotificationErrorInsertOrder } = require('../../emails/');
const createInvoice = require('../../intelisis/create-invoice');

const defaults = {
  billing: billingData,
  orders: ordersData,
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, orders } = dependencies;
  const {
    selectPendingMsOrdersToBill, selectPendingMsOrderDetail, getExchangeRate, getLastBillId, insertOrderToBill,
  } = billing;

  const { patch } = orders;

  const groupByMergeCandidates = groupBy(order => `${order.IdEmpresaDistribuidor},${order.IdEmpresaUsuarioFinal},
    ${order.IdFormaPago},${order.MonedaPago},${order.EsquemaRenovacion},${order.IdTIpoProducto !== ON_DEMAND}`);

  const auxiliaries = {};

  auxiliaries.selectPendingMsOrders = () => selectPendingMsOrdersToBill()
    .then(res => (res.length ? res : throwCustomError('Sin ordenes por facturar')));

  const updateOrder = async (ID, order) => await patch({ Facturado: 1, IdFactura: ID }, order);

  const buildBillHeader = (billData, tipoCambio, expiration, total) =>
  ({
    IdPedido: billData.IdPedido || 1,
    IdFabricante: billData.IdFabricante,
    Cliente: billData.Cliente,
    Credito: billData.Credito,
    Proyecto: billData.Proyecto,
    DominioMicrosoftUF: billData.DominioMicrosoftUF,
    RFC: billData.RFC,
    UEN: billData.UEN,
    MonedaPago: billData.MonedaPago,
    TipoCambio: tipoCambio,
    IdFormaPago: billData.IdFormaPago,
    Total: total,
    IVA: total * 0.16,
    Vencimiento: expiration,
    Agente: billData.Agente,
    EsquemaRenovacion: billData.EsquemaRenovacion,
    IdEmpresaDistribuidor: billData.IdEmpresaDistribuidor,
    IdEmpresaUsuarioFinal: billData.IdEmpresaUsuarioFinal,
  });

  const buildBillDetails = async (billData, TipoCambio) => {
    const cleanDetail = [];
    const details = await Promise.all(billData.map(async order => selectPendingMsOrderDetail(1, order.IdPedido, TipoCambio)));
    details.forEach(detailsData => {
      detailsData.forEach(detail => cleanDetail.push(detail));
    });
    return cleanDetail;
  };

  auxiliaries.updateOrders = async ordersToUpdate => Promise.all(ordersToUpdate.map(order => updateOrder(order.ID, order.details)));

  const billOrder = async order =>
  createInvoice(order, order.details)
   .then(invoiceStatus => {
     if (invoiceStatus.content.success.success === 1) {
       console.log(invoiceStatus.content.success.data.id, order.idOrdersToBill, 'resultado');
       return order.idOrdersToBill.map(async pedido => await updateOrder(invoiceStatus.content.success.data.id, pedido));
     }
     return sendNotificationErrorInsertOrder({ IdPedido: JSON.stringify(order.idOrdersToBill) }, invoiceStatus.content.success.message);
   });

  auxiliaries.billOrders = ordersToBill =>
    Promise.all(ordersToBill.map(async order => billOrder(order)));

  auxiliaries.insertOrdersToBill = async ordersToInsert => Promise.all(ordersToInsert.map(order => {
    order.idOrdersToBill.map(async item => {
      await insertOrderToBill(item, order.IdPedido);
      return item;
    });
    return order;
  }));

  auxiliaries.completeBillData = async mergedOrders => {
    const billId = await getLastBillId();
    let index = 1;
    await Promise.all(mergedOrders.map(order => {
      order.IdPedido = billId.IdFactura + index;
      index += 1;
      return order;
    }));
    return mergedOrders;
  };

  auxiliaries.groupOrdersToBill = async (ordersToRenew, limit) => {
    const groupedOrders = groupByMergeCandidates(ordersToRenew);
    const mergedOrders = [];
    const expiration = moment().add(1, 'month').format('YYYY-MM-DD');
    await Promise.all(Object.keys(groupedOrders).map(async key => {
      const currentOrderGroup = groupedOrders[key];
      const { TipoCambio } = await getExchangeRate(currentOrderGroup[0], MICROSOFT);
      const totalBill = currentOrderGroup.reduce((accumulator, current) => { accumulator += current.Total; return accumulator; }, 0);
      const idOrdersToBill = currentOrderGroup.reduce((accumulator, current) => { accumulator.push(current.IdPedido); return accumulator; }, []);
      const billHeader = buildBillHeader(currentOrderGroup[0], TipoCambio, expiration, totalBill);
      const billDetail = await buildBillDetails(currentOrderGroup, TipoCambio);
      const completeBillData = Object.assign({}, billHeader, { details: billDetail }, { idOrdersToBill });
      mergedOrders.push(completeBillData);
    }));
    return mergedOrders.slice(0, limit);
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;

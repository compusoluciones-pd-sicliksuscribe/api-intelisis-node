const { groupBy } = require('ramda');
const moment = require('moment');
const throwCustomError = require('../../../helpers/factories/errorFactory');
const billingData = require('../../../data/billing');
const ordersData = require('../../../data/orders');
const { ON_DEMAND } = require('../../../helpers/enums/product-types');
const { MICROSOFT } = require('../../../helpers/enums/makers');
const { MONTHLY } = require('../../../helpers/enums/renewal-schema-types');
const createInvoice = require('../../intelisis/create-invoice');

const { sendNotificationErrorInsertOrder } = require('../../emails/');
const defaults = {
  billing: billingData,
  orders: ordersData,
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, orders } = dependencies;
  const {
    selectPendingMsNCEMonthlyOrdersToBill, selectPendingMsNCEAnnualMonthlyOrdersToBill, selectPendingMsOrderDetail, getExchangeRate, getLastBillId, insertOrderToBill, insertActualBill,
  } = billing;

  const { patch } = orders;

  const groupByMergeCandidates = groupBy(order => `${order.IdEmpresaDistribuidor},${order.IdEmpresaUsuarioFinal},
    ${order.IdFormaPago},${order.MonedaPago},${order.EsquemaRenovacion},${order.IdTIpoProducto !== ON_DEMAND}`);

  const auxiliaries = {};

  auxiliaries.selectPendingMsNCEOrders = renovationType => {
    if (renovationType == MONTHLY) {
      return selectPendingMsNCEMonthlyOrdersToBill()
      .then(res => (res.length ? res : throwCustomError('Sin ordenes mensuales por facturar')));
    }
    return selectPendingMsNCEAnnualMonthlyOrdersToBill()
      .then(res => (res.length ? res : throwCustomError('Sin ordenes anuales con facturación por facturar')));
  };

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
    const groupDetails = [];
    let details = await Promise.all(billData.map(async order => selectPendingMsOrderDetail(1, order.IdPedido, TipoCambio)));
    details = JSON.parse(JSON.stringify(details));
    details.forEach(detailsData => {
      detailsData.forEach(detail => groupDetails.push(detail));
    });

    const combinedData = groupDetails.reduce((result, item) => {
      const existingItem = result.find(x => x.Articulo === item.Articulo);
      if (existingItem) {
        existingItem.Cantidad += item.Cantidad;
      } else {
        result.push({ ...item });
      }
      return result;
    }, []);

    return combinedData;
  };

  const updateOrder = async (ID, order) => await patch({ Facturado: 1, IdFactura: ID }, order);

  const billOrder = async order =>
  createInvoice(order, order.details)
   .then(invoiceStatus => {
     if (invoiceStatus.content.success.success === 1) {
       return order.idOrdersToBill.map(async pedido => {
         insertActualBill(pedido, order.IdPedido);
         return await updateOrder(invoiceStatus.content.success.data.id, pedido);
       });
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

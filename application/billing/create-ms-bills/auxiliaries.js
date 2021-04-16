const { groupBy } = require('ramda');
const moment = require('moment');
const throwCustomError = require('../../../helpers/factories/errorFactory');
const billingData = require('../../../data/billing');
const intelisis = require('../../intelisis');
const ordersData = require('../../../data/orders');
const { ON_DEMAND } = require('../../../helpers/enums/product-types');
const { MICROSOFT } = require('../../../helpers/enums/makers');
const { sendNotificationErrorInsertOrder, sendNotificationErrorInsertOrderDetails } = require('../../emails/');
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

  const verifyIfBillExist = order => intelisis.getSale(order.IdPedido);

  const verifyResponse = (res, { IdPedido }) => {
    const response = JSON.parse(res);
    return response.length > 0 ? response : sendNotificationErrorInsertOrderDetails({ IdPedido });
  };

  const updateOrder = async (ID, details) => Promise.all(details.map(detail => patch({ Facturado: 1, IdFactura: ID }, detail.IdPedido)));

  const billOrder = async order => {
    const bill = await intelisis.createSale(order);
    const parsedBill = JSON.parse(bill);
    if (parsedBill.length > 0) {
      order.ID = parsedBill[0].ID;
      return order.ID ? order : throwCustomError('error');
    }
    return sendNotificationErrorInsertOrder(order);
  };

  const buildBillHeader = (billData, tipoCambio, expiration, total) =>
  ({
    IdPedido: billData.IdPedido || 1,
    Cliente: billData.Cliente,
    Credito: billData.Credito,
    Proyecto: billData.Proyecto,
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

  auxiliaries.insertBillDetails = ordersToBill =>
  Promise.all(ordersToBill.map(async order => {
    if (!order.exist) {
      await Promise.all(order.details.map(async (detail, index) => {
        detail.ID = order.ID;
        detail.RenglonID = index + 1;
        detail.Renglon = (index + 1) * 2048;
        return intelisis.insertOrderDetail(detail)
        .then(res => verifyResponse(res, detail));
      }));
    }
    return order;
  }));

  auxiliaries.billOrders = ordersToBill =>
    Promise.all(ordersToBill.map(async order => {
      const billExist = await verifyIfBillExist(order);
      const response = JSON.parse(billExist);
      if (response.length > 0 && response[0].Proyecto === order.Proyecto) {
        order.exist = response.length > 0 ? 1 : 0;
        order.ID = response[0].ID;
        await updateOrder(response[0].ID, order.details);
        return order;
      }
      return billOrder(order)
        .catch(err => err);
    }));

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
    const limitOrders = ordersToRenew.slice(0, limit);
    const groupedOrders = groupByMergeCandidates(limitOrders);
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
    return mergedOrders;
  };

  return auxiliaries;
};

module.exports = auxiliariesFactory;

const billingData = require('../../../data/billing');
const intelisis = require('../../intelisis');
const ordersData = require('../../../data/orders');
const {
  sendNotificationErrorInsertOrder,
  sendNotificationErrorInsertOrderDetails,
  sendNotificationErrorInsertBillLog,
  sendCXCNotification,
  sendAgenteMarcaNotificacion,
} = require('../../emails/');

const defaults = {
  billing: billingData,
  orders: ordersData,
};

const auxiliariesFactory = (dependencies = defaults) => {
  const { billing, orders } = dependencies;
  const {
    selectPendingOrdersOpenpayToBill, selectPendingOrderDetail,
  } = billing;

  const { patch, getOpenPayDetails, getAgenteCXC, getAgenteXMarca } = orders;

  const auxiliaries = { };
  auxiliaries.selectPendingOrders = () => selectPendingOrdersOpenpayToBill();

  const validateCommission = orderDetails => {
    const products = orderDetails.data.filter(details => details.IdProducto !== 74);
    const commission = orderDetails.data.filter(details => details.IdProducto === 74)[0];
    const totalWithoutCommission = products.reduce((totalPrice, currentProduct) => totalPrice + currentProduct.Precio, 0);
    if (totalWithoutCommission > 0 && commission) products.push(commission);
    return products;
  };

  const verifyIfBillExist = order => intelisis.getSale(order.IdPedido);

  const verifyResponse = (res, { IdPedido }) => {
    const response = JSON.parse(res);
    return response.length > 0 ? response : sendNotificationErrorInsertOrderDetails({ IdPedido });
  };

  const insertOrderDetails = orderDetails => Promise.all(orderDetails.map(async (detail, index) => {
    detail.RenglonID = index + 1;
    detail.Renglon = (index + 1) * 2048;
    return intelisis.insertOrderDetail(detail)
      .then(res => verifyResponse(res, detail));
  }));

  const setBillLog = async billLog => {
    const { order, ID } = billLog;
    const openpayDetails = await getOpenPayDetails(order.IdPedido);
    if (openpayDetails.TarjetaResultIndicator) {
      const body = {
        ID,
        Evento: openpayDetails.TarjetaResultIndicator,
      };
      return intelisis.insertBillLog(body)
        .then(() => openpayDetails.TarjetaResultIndicator);
    }
    return sendNotificationErrorInsertBillLog(order);
  };

  const agenteMarcaNotificacion = async emailBody => emailBody.agenteXMarca.map(email => sendAgenteMarcaNotificacion(Object.assign({}, emailBody, { CorreoContacto: email.Correo, NombreContacto: email.Nombre })));

  const sendPaymentNotification = async (order, openpayData) => {
    const cxcAgente = await getAgenteCXC(order.IdEmpresaDistribuidor);
    const agenteXMarca = await getAgenteXMarca(order.UEN);

    await sendCXCNotification(Object.assign({}, cxcAgente, order, { openpayData }));
    await agenteMarcaNotificacion(Object.assign({}, { agenteXMarca }, order, { openpayData }));
    return order;
  };

  const billOrder = async order => {
    const bill = await intelisis.createSale(order);
    const parsedBill = JSON.parse(bill);
    if (parsedBill[0].ID) {
      return selectPendingOrderDetail(parsedBill[0].ID, parsedBill[0].IdPedidoMarketPlace)
        .then(validateCommission)
        .then(insertOrderDetails)
        .then(patch({ Facturado: 1, IdFactura: parsedBill[0].ID }, parsedBill[0].IdPedidoMarketPlace))
        .then(() => setBillLog(Object.assign({}, { order }, { ID: parsedBill[0].ID })))
        .then(openpayData => sendPaymentNotification(order, openpayData));
    }
    return sendNotificationErrorInsertOrder(order);
  };
  const updateOrder = (ID, IdPedido) => patch({ Facturado: 1, IdFactura: ID }, IdPedido);

  auxiliaries.billOrders = data =>
  Promise.all(data.map(async order => {
    const billExist = await verifyIfBillExist(order);
    const response = JSON.parse(billExist);
    return response.length > 0 ? updateOrder(response[0].ID, order.IdPedido) : billOrder(order);
  }));

  return auxiliaries;
};

module.exports = auxiliariesFactory;

/* eslint-disable no-case-declarations */
const axios = require('axios');
const URL = `${process.env.INTELIS_HOST}${process.env.ROUTE_BILLING_VENTA}`;
const projectByRFC = require('../get-project-by-rfc');
const payments = require('../../../helpers/enums/payment-types');
const paymentTypes = require('../../../helpers/enums/auxiliariesOpenpay');
const renewalSchema = require('../../../helpers/enums/renewal-schema-types');
const makers = require('../../../helpers/enums/makers');
const ordersData = require('../../../data/orders');
const openpayInfo = require('../get-openpay-info');
const GENERIC_PROJECT_CLICK = 'SICLIKSUSCRIBE';
const GENERIC_RFC_NATIONAL = 'XAXX010101000';
const GENERIC_RFC_FOREIGN = 'XEXX010101000';

const paymentMethod = async (paymentType, order) => {
  let method = '';
  switch (paymentType) {
    case paymentTypes.CARD_PAYMENT_ID:
      const cardType = await ordersData.getPaymentMethod(order);
      method = cardType ? cardType.type : payments.CREDIT_CARD;
      break;
    case paymentTypes.PAYPAL_ID:
      method = payments.PAYPAL;
      break;
    case paymentTypes.TRANSFER_ID:
      method = payments.TRANSFER;
      break;
    case paymentTypes.SPEI_ID:
      method = payments.SPEI;
      break;
    default: method = payments.TRANSFER;
  }
  return method;
};

<<<<<<< HEAD
=======
const openpayInfo = async (paymentFormat, order) => {
  let opPurchaseInfo = '';
  if (paymentFormat == paymentTypes.CARD_PAYMENT_ID) {
    const openpayPaymentInfoCC = await ordersData.getOpenpayCCInfo(order);
    opPurchaseInfo = `${openpayPaymentInfoCC.name}, ${openpayPaymentInfoCC.cart_id} (${paymentTypes.CARD_METHOD}), ${openpayPaymentInfoCC.amount}, ${moment(openpayPaymentInfoCC.register_date).format('DD/MM/YYYY')}`;
  } else {
    const openpayPaymentInfoSPEI = await ordersData.getOpenpaySpeiInfo(order);
    opPurchaseInfo = `${openpayPaymentInfoSPEI.NombreEmpresa}, ${openpayPaymentInfoSPEI.descripcion} (${paymentTypes.SPEI_METHOD}), ${openpayPaymentInfoSPEI.monto} ${openpayPaymentInfoSPEI.OPENPAY_PESOS_CURRENCY}, ${moment(openpayPaymentInfoSPEI.fechaCreacion).format('DD/MM/YYYY')}`;
  }
  return opPurchaseInfo;
};

const evaluateComments = order => {
  if (order.IdFabricante === makers.AUTODESK) {
    return order.Estado;
  } else if (order.IdEsquemaRenovacion === renewalSchema.ANNUAL_MONTHLY) {
    return `${order.EsquemaRenovacion} ${order.FechaInicio} - ${order.FechaFin}`;
  } return order.EsquemaRenovacion;
};

>>>>>>> cc18d07c7c745e2a46ed37036cb181e63c3325e3
const formatDetails = async (orderDetails, fabricante) => {
  let index = 0;
  const details = await orderDetails.map(detail => {
    index += 1;
    const renglon = index * 2048;

    const ventaDetail = {
      Renglon: renglon,
      RenglonId: index,
      Articulo: detail.Articulo,
      Unidad: 'Servicio',
      Almacen: 'GI09',
      EnviarA: 1,
      RenglonTipo: 'N',
      Cantidad: detail.Cantidad,
      Precio: detail.Precio,
      Impuesto1: 16,
      DescripcionExtra: detail.DescripcionExtra && fabricante === 2 ? detail.DescripcionExtra : 0,
      descCupon: fabricante === makers.AUTODESK ? detail.DescuentoSP : 0,
      SerieClik: fabricante === makers.AUTODESK ? detail.serialNumber : null,
    };

    return ventaDetail;
  });

  return Promise.all(details);
};


const insertInvoiceIntelisis = async (order, details) => {
  let project = '';
  let openpayObs = '';
  const ventaDetails = await formatDetails(details, order.IdFabricante);
  const projectExist = await projectByRFC(order.RFC);
  if (order.RFC === GENERIC_RFC_NATIONAL || order.RFC === GENERIC_RFC_FOREIGN || !projectExist.proyect_name) { project = GENERIC_PROJECT_CLICK; } else project = projectExist.proyect_name;
  if (order.IdFormaPago === paymentTypes.CARD_PAYMENT_ID || order.IdFormaPago === paymentTypes.SPEI_ID) openpayObs = await openpayInfo(order.IdFormaPago, order.IdPedido);

  const body = {
    OrdenCompra: order.OrdenCompra,
    Referencia: order.IdPedido,
    Empresa: 'CS',
    Mov: 'Factura CS',
    Usuario: 'INTERNET',
    Almacen: 'GI09',
    Moneda: order.MonedaPago === 'Pesos' ? 'Pesos' : 'Dolares',
    TipoCambio: order.MonedaPago === 'Pesos' ? 1 : order.TipoCambio,
    Cliente: order.Cliente,
    FormaEnvio: 'Marketplace',
    Condicion: order.IdFormaPago === paymentTypes.CREDIT_ID ? payments.CREDIT : payments.CASH,
    FormaPagoTipo: order.IdFormaPago === paymentTypes.CREDIT_ID ? payments.CREDIT : await paymentMethod(order.IdFormaPago, order.IdPedido),
    Proyecto: project,
    Concepto: 'MarketPlace',
    UEN: order.UEN,
    Agente: order.Agente ? order.Agente : 'SINAGENTE',
    EnviarA: 1,
    AgenteServicio: 'SINAGENTE',
    ZonaImpuesto: 'Nacional',
    Causa: 'Adquisición de mercancias - G01',
<<<<<<< HEAD
    Observaciones: `${openpayObs} ${order.Observaciones}`,
    Comentarios: order.IdFabricante === 2 ? order.Estado : order.EsquemaRenovacion,
    ContratoDescripcion: order.IdFabricante === 1 ? `${order.Proyecto.slice(0, 79)}/${order.DominioMicrosoftUF.slice(0, 20)}` : order.Proyecto,
=======
    Observaciones: order.IdFormaPago === paymentTypes.CARD_PAYMENT_ID || order.IdFormaPago === paymentTypes.SPEI_ID ? await openpayInfo(order.IdFormaPago, order.IdPedido) : order.Observaciones,
    Comentarios: evaluateComments(order),
    ContratoDescripcion: order.IdFabricante === makers.MICROSOFT ? `${order.Proyecto.slice(0, 79)}/${order.DominioMicrosoftUF.slice(0, 20)}` : order.Proyecto,
>>>>>>> cc18d07c7c745e2a46ed37036cb181e63c3325e3
    VentaD: ventaDetails,
  };
  return axios.post(URL, body).then(response => response.data);
};


module.exports = insertInvoiceIntelisis;

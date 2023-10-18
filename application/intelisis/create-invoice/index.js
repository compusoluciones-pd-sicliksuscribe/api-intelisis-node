/* eslint-disable no-case-declarations */
const axios = require('axios');
const URL = `${process.env.INTELIS_HOST}${process.env.ROUTE_BILLING_VENTA}`;
const projectByRFC = require('../get-project-by-rfc');
const payments = require('../../../helpers/enums/payment-types');
const paymentTypes = require('../../../helpers/enums/auxiliariesOpenpay');
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
      descCupon: fabricante === 2 ? detail.DescuentoSP : 0,
      SerieClik: fabricante === 2 ? detail.serialNumber : null,
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
    Condicion: order.IdFormaPago === 2 ? payments.CREDIT : payments.CASH,
    FormaPagoTipo: order.IdFormaPago === 2 ? payments.CREDIT : await paymentMethod(order.IdFormaPago, order.IdPedido),
    Proyecto: project,
    Concepto: 'MarketPlace',
    UEN: order.UEN,
    Agente: order.Agente ? order.Agente : 'SINAGENTE',
    EnviarA: 1,
    AgenteServicio: 'SINAGENTE',
    ZonaImpuesto: 'Nacional',
    Causa: 'Adquisición de mercancias - G01',
    Observaciones: `${openpayObs} ${order.Observaciones}`,
    Comentarios: order.IdFabricante === 2 ? order.Estado : order.EsquemaRenovacion,
    ContratoDescripcion: order.IdFabricante === 1 ? `${order.Proyecto}/${order.DominioMicrosoftUF}` : order.Proyecto,
    VentaD: ventaDetails,
  };
  return axios.post(URL, body).then(response => response.data);
};


module.exports = insertInvoiceIntelisis;

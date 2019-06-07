const emailTypes = { };
const {
  environment, bccMailList,
} = require('../../../config');

const getBaseMail = (mailContent, template) => {
  const body = {
    from: 'Click Suscribe CompuSoluciones <clicksuscribe@compusoluciones.com>',
    to: mailContent.address,
    bcc: bccMailList,
    subject: `${environment === 'test' ? '[TEST] ' : ''}${mailContent.subject}`,
    text: mailContent.subject,
    html: template(mailContent),
    watchHtml: template(mailContent),
  };
  return body;
};
emailTypes.NotificationErrorInsertOrder = (body, template) => {
  const emailBody = Object.assign({}, body);
  emailBody.address = ['clicksuscribe@compusoluciones.com'];
  emailBody.subject = 'API Intelisis - Error al facturar';
  emailBody.title = '<br>Fallo al intentar realizar el registro de la factura en Intelisis';
  emailBody.message = `
    <br><br>Error al facturar pedido<br>
    <br> IdPedido: ${body.IdPedido}
  `;
  return getBaseMail(emailBody, template);
};

emailTypes.NotificationErrorInsertOrderDatails = (body, template) => {
  const emailBody = Object.assign({}, body);
  emailBody.address = ['mhernandez@compusoluciones.com'];
  emailBody.subject = 'API ClickSuscribe - Error al registrar detalles de factura';
  emailBody.title = '<br>Fallo al registrar los detalles de facturación en Intelisis';
  emailBody.message = `
    <br><br>Error al insertar detalle del pedido
    <br> IdPedido: ${body.IdPedido}<br>

  `;
  return getBaseMail(emailBody, template);
};

module.exports = emailTypes;

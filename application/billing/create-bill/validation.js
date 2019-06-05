const Joi = require('joi');
const help = require('../../../helpers/help');

const billSchema = Joi.object().keys({
  IdPedido: Joi.required(),
  IdPrimerPedido: Joi.required(),
  Cliente: Joi.required(),
  Proyecto: Joi.required(),
  UEN: Joi.required(),
  MonedaPago: Joi.required(),
  TipoCambio: Joi.required(),
  IdFormaPago: Joi.required(),
  Vencimiento: Joi.required(),
  EsquemaRenovacion: Joi.required(),
});

const response = (err, IdPedido) => help.r$(0, 'IdPedido: ' + IdPedido + ' ,Error en el campo [' + err.details[0].path + ']');

const validatePendingBills = (pendingOrdersToBill) => {
  if (pendingOrdersToBill.data[0].length >= 1) {
    const errors = [];
    pendingOrdersToBill.data[0].map((bill) => {
      Joi.validate(bill, billSchema, (err) => {
        if (err) {
          errors.push(response(err, bill.IdPedido));
        }
      });
      return errors;
    });
    if (errors.length > 0) {
      return Promise.reject(errors);
    }
    return Promise.resolve(pendingOrdersToBill);
  }
  return 'Termine';
};

module.exports = validatePendingBills;

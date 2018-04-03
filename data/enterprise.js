const help = require('../helpers/help');

const enterprise = {};

enterprise.put = ({ transferencia, IdERP }) => help.d$().update('traEmpresas', { transferencia }, { IdERP });

module.exports = enterprise;

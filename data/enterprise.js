const help = require('../helpers/help');

const enterprise = {};

enterprise.put = ({ Transferencia, IdERP }) => help.d$().update('traEmpresas', { Transferencia }, { IdERP });

module.exports = enterprise;

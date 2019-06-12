const help = require('../helpers/help');

const enterprise = {};

enterprise.put = ({ transferencia, IdERP }) => help.d$().update('traEmpresas', { transferencia }, { IdERP });

enterprise.updateTransferenciaDolares = (transferencia, IdERP) => help.d$().query(`
UPDATE traEmpresas SET TransferenciaDolares = ? WHERE IdERP = ?`,
[transferencia, IdERP]);

module.exports = enterprise;


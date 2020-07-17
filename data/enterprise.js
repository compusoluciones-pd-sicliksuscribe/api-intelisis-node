const help = require('../helpers/help');
const gateway = require('../helpers/gateway')();

const enterprise = {};

enterprise.put = ({ transferencia, IdERP }) => help.d$().update('traEmpresas', { transferencia }, { IdERP });

enterprise.updateTransferenciaDolares = (transferencia, IdERP) => help.d$().query(`
UPDATE traEmpresas SET TransferenciaDolares = ? WHERE IdERP = ?`,
[transferencia, IdERP]);

enterprise.insertCXCAgente = ({ CorreoContacto = 'clicksuscribe@compusoluciones.com', NombreContacto = 'SINCONTACTO' }, IdEmpresa) =>
    gateway.upsert('catContactoCXC', {
      IdEmpresa,
      CorreoContacto,
      NombreContacto,
      FechaActivo: gateway.now(),
    });

enterprise.getIdEmpresa = IdERP => gateway.query('SELECT IdEmpresa FROM traEmpresas WHERE IdERP = ?', [IdERP]).then(res => res[0]);

module.exports = enterprise;


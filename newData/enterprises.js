const gateway = require('../helpers/gateway')();

const enterprises = {};

enterprises.getAvailableCredit = enterpriseId => (
  gateway.query(`Select clients.assigned_credit, SUM((bills.amount+bills.tax)) as debt 
    from clients inner join bills on bills.client_id = clients.id where clients.id = ? and bills.status in (1,2);`, [enterpriseId])
    .then(rows => ({ assignedCredit: rows[0].assigned_credit, debt: rows[0].debt }))
);

module.exports = enterprises;

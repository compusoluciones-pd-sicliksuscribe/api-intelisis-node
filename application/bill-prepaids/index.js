const applyOrderPrepaid = require('../intelisis/bill-prepaids/create-order');
const applyOrderDetailsPrepaid = require('../intelisis/bill-prepaids/create-order-details');
const affectOrderPrepaidIntelisis = require('../intelisis/bill-prepaids/affect-order');

const extractOrderDetailsById = (erpResponse, orders) => {
  const id = erpResponse[0].ID;
  const updateDetails = orders.detalles.map((detail, index) => {
    const RenglonID = index + 1;
    const Renglon = (index + 1) * 2048;
    const detailWithId = Object.assign({}, detail, { ID: id, Renglon, RenglonID });
    return applyOrderDetailsPrepaid(detailWithId);
  });
  return Promise.all(updateDetails)
  .then(() => id);
};

const extractDetailsById = orders => {
  return applyOrderPrepaid(orders) //primera ronda
  .then(erpResponse => extractOrderDetailsById(erpResponse, orders))
  .then(billId => affectOrderPrepaidIntelisis(billId, orders));
};

const billPrepaids = orders => (
extractDetailsById(orders)
);

module.exports = { billPrepaids };

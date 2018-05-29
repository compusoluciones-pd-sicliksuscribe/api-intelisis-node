const applyOrderPrepaid = require('../intelisis/bill-prepaids/create-order');
const applyOrderDetailsPrepaid = require('../intelisis/bill-prepaids/create-order-details');

const extractDetailsById = orders => {
  applyOrderPrepaid(orders)
  .then(erpResponse => {
    const id = erpResponse[0].ID;
    const updateDetails = orders.detalles.map((detail, index) => {
      const renglonId = index + 1;
      const renglon = renglonId * 2048;
      const detailWithId = Object.assign({}, detail, { ID: id, renglon, renglonId });
      return applyOrderDetailsPrepaid(detailWithId);
    });
    return Promise.all(updateDetails);
  })
  .then(erpResponse => applyOrderDetailsPrepaid(erpResponse, orders));
};

const billPrepaids = orders => (
extractDetailsById(orders)
);

module.exports = { billPrepaids };

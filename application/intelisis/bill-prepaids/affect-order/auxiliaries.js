const { requestPromise } = require('../../../../helpers/logged-request');
const config = require('../../../../config');

const applyaffectOrder = () => {
  const mapOrderParameters = billId => ({
    ID: billId,
  });

  const getOptions = billId => ({
    method: 'PUT',
    uri: `${config.ApiErp}/PedidoD`,
    body: mapOrderParameters(billId),
    headers: {
      token: config.TokenERP,
    },
    json: true,
  });

  const affectOrderIntelisis = billId => {
    const requestOptions = getOptions(billId);
    return requestPromise(requestOptions);
  };

  return {
    affectOrderIntelisis,
  };
};

module.exports = applyaffectOrder;

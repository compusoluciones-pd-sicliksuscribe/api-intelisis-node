const config = require('../../../../config');
const { requestPromise } = require('../../../../helpers/logged-request');

const getOrdersBalance = () => {
  const getBalance = id => ({
    method: 'GET',
    uri: `${config.ApiErp}Pedido/${id}`,
    headers: {
      token: config.TokenERP,
    },
  });

  const getLastBalancePrepaid = ({ id }) => {
    const requestOptions = getBalance(id);
    return requestPromise(requestOptions);
  };

  return {
    getLastBalancePrepaid,
  };
};

module.exports = getOrdersBalance;

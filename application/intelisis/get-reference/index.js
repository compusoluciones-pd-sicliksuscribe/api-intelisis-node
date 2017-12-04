const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');

const getSale = (IdPedido) => {
  const options = {
    method: 'GET',
    uri: config.ApiErp + 'Venta/' + IdPedido,
    headers: {
      token: config.TokenERP,
    },
  };

  return requestPromise(options)
    .catch((error) => {
      throw error;
    })
    .then(result => result);
};

module.exports = getSale;

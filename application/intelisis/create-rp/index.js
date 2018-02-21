const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');

const createRP = (ID, TipoCambioRP) => {
  const options = {
    method: 'PUT',
    uri: config.ApiErp + 'VentaD',
    form: {
      ID,
      TipoCambioRP,
    },
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

module.exports = createRP;

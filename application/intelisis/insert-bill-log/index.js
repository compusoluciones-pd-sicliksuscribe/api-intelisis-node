const moment = require('moment');
const { requestPromise } = require('../../../helpers/logged-request');
const config = require('../../../config');

const insertBillLog = async ({ ID, Evento }) => {
  const parameters = {
    ID,
    Evento,
  };

  const options = {
    method: 'POST',
    uri: config.ApiErp + 'VentaBitacora',
    form: parameters,
    headers: {
      token: config.TokenERP,
    },
  };

  return requestPromise(options)
    .catch(error => {
      throw error;
    })
    .then(result => result);
};

module.exports = insertBillLog;

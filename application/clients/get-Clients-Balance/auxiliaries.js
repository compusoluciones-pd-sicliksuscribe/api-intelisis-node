const config = require('../../../config');
const { requestPromise } = require('../../../helpers/logged-request');
const enterpriseData = require('../../../data/enterprise');
const ordersData = require('../../../data/orders');
const logger = require('../../../helpers/logger').debugLogger;
const throwCustomError = require('../../../helpers/factories/errorFactory');

const defaultDependencies = {
  enterprise: enterpriseData,
  orders: ordersData,
};

const getClientsBalance = (dependencies = defaultDependencies) => {
  const { enterprise, orders } = dependencies;

  const { getPrepaidOrdersWithoutBill } = orders;

  const applyLastBalance = async ({ transferencia, IdERP, moneda }) => {
    if (moneda === 'Dólares') {
      return enterprise.updateTransferenciaDolares(transferencia, IdERP)
      .then(() => {
        logger.info('Prepaid Balance Updated');
        return {
          success: 1,
          message: 'Información actualizada. Transferencia dolares',
          data: { transferencia, IdERP },
        };
      });
    } else if (moneda === 'Pesos') {
      return enterprise.put({ transferencia, IdERP })
      .then(() => {
        logger.info('Prepaid Balance Updated');
        return {
          success: 1,
          message: 'Información actualizada. Transferencia pesos',
          data: { transferencia, IdERP },
        };
      });
    }
    return throwCustomError('Moneda no válida');
  };

    /*
    Ruta Api C# de Intelisis
    /Anticipos/G000000
    */

  const getBalance = (id, moneda) => ({
    method: 'GET',
    uri: `${config.ApiErp}Anticipos/${id}/${moneda}`,
    headers: {
      token: config.TokenERP,
    },
  });

  const getLastBalancePrepaid = ({ id, moneda }) => {
    const requestOptions = getBalance(id, moneda);
    return requestPromise(requestOptions)
      .then(transferencia => ({ transferencia, IdERP: id, moneda }));
  };

  const getOrdersWithoutBill = async data => {
    const prepaidOrdersWithoutBill = await getPrepaidOrdersWithoutBill(data.IdERP);
    let totalAmount = 0;
    if (prepaidOrdersWithoutBill.totalDebt && data.transferencia) {
      totalAmount = data.transferencia - prepaidOrdersWithoutBill.totalDebt;
    } else {
      totalAmount = data.transferencia;
    }
    data.transferencia = totalAmount;
    return data;
  };

  return {
    applyLastBalance,
    getLastBalancePrepaid,
    getOrdersWithoutBill,
  };
};

module.exports = getClientsBalance;

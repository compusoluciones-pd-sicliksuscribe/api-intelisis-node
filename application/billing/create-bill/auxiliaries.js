const promiseFor = require('../../../helpers/promise-for');
const { sendNotificationErrorInsertOrder, sendNotificationErrorInsertOrderDatails } = require('../../emails/');

const validateCommission = orderDetails => {
  const products = orderDetails.data.filter(details => details.IdProducto !== 74);
  const commission = orderDetails.data.filter(details => details.IdProducto === 74)[0];
  const totalWithoutCommission = products.reduce((totalPrice, currentProduct) => totalPrice + currentProduct.Precio, 0);
  if (totalWithoutCommission > 0 && commission) products.push(commission);
  return products;
};
class Auxiliaries {
  constructor(ordersData, intelisis, billingData) {
    this.ordersData = ordersData;
    this.intelisis = intelisis;
    this.billingData = billingData;
  }

  bill(ordersToBill) {
    if (ordersToBill.data.length > 0) {
      return promiseFor(count => count < ordersToBill.data.length,
        count => this.intelisis.getSale(ordersToBill.data[count].IdPedido)
          .then(result => {
            const response = JSON.parse(result);
            if (response.length > 0) {
              return this.updateSalesId(JSON.parse(result)[0].ID, ordersToBill.data[count].IdPedido)
                .then(() => {
                  // cuando se refactorice, revisar el estatus del resultado y en caso de un error enviar correo, no se contemplo en la tarjeta
                  return ++count;
                });
            }

            return this.insertIntelisis(ordersToBill.data[count])
            .then((result) => {
              if (result !== 1) {
                sendNotificationErrorInsertOrder(ordersToBill.data[count]);
              }

              return ++count;
            });
          })
        , 0).then(() => 'Ordenes facturadas');
    }
    return Promise.resolve('No hay ordenes por facturar');
  }

  updateSalesId(ID, IdPedido) {
    return this.ordersData.patch({ Facturado: 1, IdFactura: ID }, IdPedido)
      .then(updateResult => updateResult);
  }

  insertIntelisis(orderToBill) {
    return this.intelisis.createSale(orderToBill)
      .then((bill) => {
        const parsedBill = JSON.parse(bill);
        if (parsedBill.length > 0) {
          return this.billingData.selectPendingOrderDetail(parsedBill[0].ID, parsedBill[0].IdPedidoMarketPlace)
            .then(validateCommission)
            .then(orderDetails => this.insertOrderDetails(orderDetails))
            .then(this.ordersData.patch({ Facturado: 1, IdFactura: parsedBill[0].ID }, parsedBill[0].IdPedidoMarketPlace))
            .then(detailResult => Promise.resolve(detailResult));
        }
        return Promise.reject('No se pudo crear la factura en intelisis');
      });
  }

  insertOrderDetails(orderDetails) {
    return promiseFor(count => count < orderDetails.length,
      (count) => {
        orderDetails[count].RenglonID = count + 1;
        orderDetails[count].Renglon = (count + 1) * 2048;
        return this.intelisis.insertOrderDetail(orderDetails[count])
          .then((result) => {
            if (result.oResultado.Success !== true) {
              sendNotificationErrorInsertOrderDatails(orderDetails[count]);
            }

            return ++count;
          });
      }, 0);
      // .then(() => this.insertRP(orderDetails.data[0].ID, orderDetails.data[0].IdPedido)); // Actualizacion de CDFI 3.3, no se permiten RPs
  }

  insertRP(ID, IdPedido) {
    return this.billingData.selectRP(IdPedido)
      .then((RP) => {
        const TipoCambioRP = RP.data[0].TipoCambioRP;
        return this.intelisis.createRP(ID, TipoCambioRP)
          .then((rpResult) => {
            // cuando se refactorice, revisar el estatus del resultado y en caso de un error enviar correo, no se contemplo en la tarjeta
            return rpResult;
          });
      });
  }

}

module.exports = Auxiliaries;

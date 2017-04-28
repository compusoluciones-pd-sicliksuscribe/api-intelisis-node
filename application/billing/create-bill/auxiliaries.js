const promiseFor = require('../../../helpers/promise-for');

class Auxiliaries {
  constructor(ordersData, intelisis) {
    this.ordersData = ordersData;
    this.intelisis = intelisis;
  }

  bill(ordersToBill) {
    if (ordersToBill.data) {

      return promiseFor(count => count < ordersToBill.data.length,
      count => this.intelisis.getSale(ordersToBill.data[count].IdPedido)
        .then((result) => {
          console.log(ordersToBill.data[count].IdPedido);
          console.log(JSON.parse(result));
          return ++count;
        })
      , 0).then(() => 'Ordenes facturadas');

      // return promiseFor(count => count < ordersToBill.data.length,
      //   count => this.intelisis.createSale(ordersToBill.data[count])
      //     .then((result) => {
      //       console.log(result);
      //       return ++count;
      //     })
      //     .catch(console.log)
      //   , 0).then(() => 'Ordenes facturadas');
    }
    return Promise.reject('Ordenes facturadas 2');
  }

}

module.exports = Auxiliaries;

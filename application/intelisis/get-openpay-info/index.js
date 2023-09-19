const moment = require('moment');
const ordersData = require('../../../data/orders');
const paymentTypes = require('../../../helpers/enums/auxiliariesOpenpay');
const array = require('joi/lib/types/array');



const openpayInfo = async (paymentFormat, order) => {
    let resInfo = '';
    let paymentMethod = '';
    const errorMssg = 'Pago no realizado en la plataforma.';
    if (paymentFormat == paymentTypes.CARD_PAYMENT_ID) {
        resInfo = await ordersData.getOpenpayCCInfo(order);
        if (resInfo.data[0]) {
            let descriptionArray = new String(resInfo.data[0].des);
            paymentMethod = `(${descriptionArray[paymentTypes.CARD_PAYMENT_ID]})${paymentTypes.CARD}`;
        } else {
            return errorMssg;
        }
    } else {
        resInfo = await ordersData.getOpenpaySpeiInfo(order).catch(error => console.log(error));
        paymentMethod = paymentTypes.SPEI;
        if (resInfo.data[0]) {
            paymentMethod = paymentTypes.SPEI;
        } else {
            return errorMssg;
        }
    }
    return resInfo.data[0] ? `id:${resInfo.data[0].idOP}, ${paymentMethod}, ${moment(resInfo.data[0].date).format('DD/MM/YYYY')}` : errorMssg;
};

module.exports = openpayInfo;

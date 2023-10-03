const moment = require('moment');
const ordersData = require('../../../data/orders');
const paymentTypes = require('../../../helpers/enums/auxiliariesOpenpay');
const array = require('joi/lib/types/array');
const { FIRST_ITEM } = paymentTypes;

const openpayInfo = async (paymentFormat, order) => {
    let resInfo = '';
    let paymentMethod = '';
    let stringId = 'id:';
    const errorMssg = 'Pago no realizado en la plataforma.';
    if (paymentFormat == paymentTypes.CARD_PAYMENT_ID) {
        resInfo = await ordersData.getOpenpayCCInfo(order);
        if (resInfo.data[FIRST_ITEM]) {
            let descriptionArray = new String(resInfo.data[FIRST_ITEM].des);
            paymentMethod = `(${descriptionArray[paymentTypes.CARD_PAYMENT_ID]})${paymentTypes.CARD}`;
        } else {
            return errorMssg;
        }
    } else {
        resInfo = await ordersData.getOpenpaySpeiInfo(order).catch(error => console.log(error));
        paymentMethod = paymentTypes.SPEI;
        if (resInfo.data[FIRST_ITEM]) {
            paymentMethod = paymentTypes.SPEI;
        } else {
            return errorMssg;
        }
    }
    return resInfo.data[FIRST_ITEM] ? `${stringId}${resInfo.data[FIRST_ITEM].idOP}, ${paymentMethod}, ${moment(resInfo.data[FIRST_ITEM].date).format('DD/MM/YYYY')}` : errorMssg;
};

module.exports = openpayInfo;

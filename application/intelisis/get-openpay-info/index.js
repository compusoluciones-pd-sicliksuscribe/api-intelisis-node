const moment = require('moment');
const ordersData = require('../../../data/orders');
const paymentTypes = require('../../../helpers/enums/auxiliariesOpenpay');
const op = require('../../../helpers/enums/helperOp');
const { FIRST_ITEM, PAYMENT_NOT_FOUND, ID, DATE } = op;

const openpayInfo = async (paymentFormat, order) => {

    let resInfo = '';
    let paymentMethod = '';
    if (paymentFormat == paymentTypes.CARD_PAYMENT_ID) {
        resInfo = await ordersData.getOpenpayCCInfo(order);
        if (resInfo.data[FIRST_ITEM]) {
            let descriptionArray = resInfo.data[FIRST_ITEM].des
            paymentMethod = `(${descriptionArray[paymentTypes.CARD_PAYMENT_ID]})${paymentTypes.CARD}`;
        } else {
            return PAYMENT_NOT_FOUND;
        }
    } else {
        resInfo = await ordersData.getOpenpaySpeiInfo(order);
        paymentMethod = paymentTypes.SPEI;
        if (resInfo.data[FIRST_ITEM]) {
            paymentMethod = paymentTypes.SPEI;
        } else {
            return PAYMENT_NOT_FOUND;
        }
    }
    return resInfo.data[FIRST_ITEM] ? `${ID}${resInfo.data[FIRST_ITEM].idOP}, ${paymentMethod}, ${moment(resInfo.data[FIRST_ITEM].date).format(DATE)}` : PAYMENT_NOT_FOUND;
};

module.exports = openpayInfo;

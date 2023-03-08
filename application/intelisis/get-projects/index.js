const axios = require('axios');
const URL = `${process.env.INTELIS_HOST}${process.env.ROUTE_BILLING_VENTA}`;

const getProjectsIntelisis = () => axios.get(URL).then(response => response.data);

module.exports = getProjectsIntelisis;

const axios = require('axios');
const URL = `${process.env.INTELIS_HOST}${process.env.ROUTE_PROJECTS_BY_RFC}`;

const getProjectsByRFCIntelisis = RFC => axios.post(URL, { rfc: RFC }).then(response => response.data.content.data);

module.exports = getProjectsByRFCIntelisis;

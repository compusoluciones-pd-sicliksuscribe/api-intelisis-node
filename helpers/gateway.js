const getGateway = require('@compusoluciones/csmysql-gateway');

const defaultConfig = require('../configs/database');


module.exports = (config = defaultConfig) => getGateway(config);

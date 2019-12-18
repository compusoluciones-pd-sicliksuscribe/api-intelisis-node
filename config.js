'use strict';

// libreria de mysql
const mySqlModel = require('mysql');

module.exports = {

  TokenERP: 'csD3s@rr01103x73rn0@pi1nt3l1s1s2016',
  IdProductoComisionTuClick: 2118,
  ApiErp: process.env.API_ERP,
  AccessControlAllowOrigin: '*',
  bccMailList: process.env.BCC_MAIL_LIST,
  connectionPool: mySqlModel.createPool({
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    debug: false,
  }),

};

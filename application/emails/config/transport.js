const emailerConfig = {};

emailerConfig.nodemailerTransport = {
  host: 'smtp.office365.com',
  port: '587',
  auth: {
    user: 'clicksuscribe@compusoluciones.com',
    pass: 'lzxmtdckymfwwccx',
  },
  secureConnection: false,
  secure: false,
  requireTLS: true,
  tls: {
    ciphers: 'SSLv3',
  },
// se descomenta para pruebas
  // service: 'gmail',
  // auth: {
  //   user: 'siclicksuscribe@gmail.com',
  //   pass: 'Inn0vaci0n',
  // },
};

module.exports = emailerConfig;

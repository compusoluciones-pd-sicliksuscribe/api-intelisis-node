const nodemailer = require('nodemailer');
const transport = require('./transport').nodemailerTransport;
const emailer = {};
const logger = require('../../../helpers/logger').debugLogger;

const transporter = nodemailer.createTransport(transport);

const handleError = error => {
  if (error) {
    logger.error('Email error');
    logger.error(error);
  }
};

emailer.send = email => {
  transporter.sendMail(email, handleError);
};


module.exports = emailer;

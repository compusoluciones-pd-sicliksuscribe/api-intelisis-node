const emailFactory = require('./config/email-factory');
const emailer = require('./config/emailer');
const template = require('./templates/default');
const emailService = {};

emailService.sendNotificationErrorInsertOrder = (body, message) => {
  body.message = message;
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertOrder', template);
  emailer.send(email);
};
emailService.sendNotificationErrorInsertOrderDetails = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertOrderDetails', template);
  emailer.send(email);
};

module.exports = emailService;

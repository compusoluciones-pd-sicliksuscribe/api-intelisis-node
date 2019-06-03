const emailFactory = require('./config/email-factory');
const emailer = require('./config/emailer');
const template = require('./templates/default');
const emailService = {};

emailService.sendNotificationErrorInsertOrder = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertOrder', template);
  emailer.send(email);
};
emailService.sendNotificationErrorInsertOrderDatails = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertOrderDatails', template);
  emailer.send(email);
};

module.exports = emailService;

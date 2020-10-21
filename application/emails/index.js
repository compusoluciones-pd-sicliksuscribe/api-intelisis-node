const emailFactory = require('./config/email-factory');
const emailer = require('./config/emailer');
const template = require('./templates/default');
const emailService = {};

emailService.sendNotificationErrorInsertOrder = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertOrder', template);
  emailer.send(email);
};

emailService.sendNotificationErrorInsertOrderDetails = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertBinnacle', template);
  emailer.send(email);
};

emailService.sendNotificationErrorInsertBillLog = body => {
  const email = emailFactory.buildEmail(body, 'NotificationErrorInsertBillLog', template);
  emailer.send(email);
};

emailService.sendCXCNotification = body => {
  const email = emailFactory.buildEmail(body, 'NotificationCXCPayment', template);
  emailer.send(email);
  return body;
};

emailService.sendAgenteMarcaNotificacion = body => {
  const email = emailFactory.buildEmail(body, 'NotificationAgenteMarca', template);
  emailer.send(email);
  return body;
};

module.exports = emailService;

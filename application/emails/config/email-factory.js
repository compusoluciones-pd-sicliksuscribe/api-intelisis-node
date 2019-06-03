const emailTypes = require('./email-types');
const emailFactory = {};

emailFactory.buildEmail = (body, type, templateTuClick) => {
  const getEmail = emailTypes[type];
  if (getEmail === undefined) throw new Error('That type of email does not exist, review email-types.js');
  return getEmail(body, templateTuClick);
};

module.exports = emailFactory;

const authRules = require('./auth');
const rateLimiterRules = require('./rateLimit');

const rules = [rateLimiterRules, authRules];

module.exports = rules;

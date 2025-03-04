const { shield, allow } = require('graphql-shield');
const authMiddleware = require('../../middleware/auth');

const rules = shield({
    Query: {
        '*': authMiddleware,
        todos: allow,
        todo: allow
    },
    Mutation: {
        '*': authMiddleware,
        LoginUser: allow,
        SignupUser: allow
    }
});

module.exports = rules;

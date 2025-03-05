const { shield, allow } = require('graphql-shield');
const CustomError = require('../../shared/error');
const authMiddleware = require('../../middleware/auth');

const authRules = shield(
    {
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
    },
    {
        fallbackError: async (thrownError, parent, args, context, info) => {
            if (thrownError instanceof CustomError) throw thrownError;

            throw new CustomError(
                thrownError.message ?? 'Something went wrong with auth check!',
                500
            );
        }
    }
);

module.exports = authRules;

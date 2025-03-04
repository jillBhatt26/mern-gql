const { shield, allow } = require('graphql-shield');
const CustomError = require('../../common/error');
const authMiddleware = require('../../middleware/auth');

const rules = shield(
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
                thrownError.message ?? 'Something went wrong!',
                500
            );
        }
    }
);

module.exports = rules;

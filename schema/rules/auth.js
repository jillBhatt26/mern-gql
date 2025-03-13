const { GraphQLError } = require('graphql');
const { shield, allow } = require('graphql-shield');
const CustomError = require('../../common/CustomError');
const authMiddleware = require('../../middleware/auth');

const authRules = shield(
    {
        Query: {
            '*': authMiddleware,
            hello: allow
        },
        Mutation: {
            '*': authMiddleware,
            LoginUser: allow,
            SignupUser: allow
        }
    },
    {
        fallbackError: async (thrownError, parent, args, context, info) => {
            if (thrownError instanceof CustomError) {
                return new GraphQLError(thrownError.message, {
                    extensions: { code: thrownError.code }
                });
            }

            return new GraphQLError(
                thrownError ?? 'Something went wrong with auth check!',
                {
                    extensions: { code: 500 }
                }
            );
        }
    }
);

module.exports = authRules;

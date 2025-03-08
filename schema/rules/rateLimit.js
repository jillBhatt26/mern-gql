const { createRateLimitRule } = require('graphql-rate-limit');
const { shield } = require('graphql-shield');
const CustomError = require('../../common/CustomError');

const rateLimitRule = createRateLimitRule({
    identifyContext: ctx => ctx.req.session.userID
});

const rateLimiter = rateLimitRule({ window: '1m', max: 50 });

const rateLimiterRules = shield(
    {
        Query: {
            '*': rateLimiter
        },
        Mutation: {
            '*': rateLimiter
        }
    },
    {
        fallbackError: async (thrownError, parent, args, context, info) => {
            if (thrownError instanceof CustomError) throw thrownError;

            throw new CustomError(
                thrownError.message ??
                    'Something went wrong with rate limit check!',
                500
            );
        }
    }
);

module.exports = rateLimiterRules;

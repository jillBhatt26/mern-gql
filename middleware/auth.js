const { rule } = require('graphql-shield');
const CustomError = require('../common/CustomError');
const UserModel = require('../models/User');

const authMiddleware = async (parent, args, context, info) => {
    try {
        const {
            req: { session }
        } = context;

        if (!session || !session.userID || !session.username)
            return new CustomError('You need to login first!', 401);

        const authUser = await UserModel.findOne({
            _id: session.userID,
            username: session.username
        });

        args.user = {
            _id: session.userID,
            username: session.username
        };

        return authUser !== null;
    } catch (error) {
        if (error instanceof CustomError) return error;

        return new CustomError(
            error ?? 'Failed to authenticate the user!',
            500
        );
    }
};

module.exports = rule('authMiddleware')(authMiddleware);

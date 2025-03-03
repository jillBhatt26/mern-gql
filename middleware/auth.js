const CustomError = require('../common/error');
const UserModel = require('../models/User');

const authMiddleware = async (resolve, parent, args, context, info) => {
    try {
        const {
            req: { session }
        } = context;

        if (!session.userID || !session.username) {
            throw new CustomError('You need to login first!', 401);
        }

        const authUser = await UserModel.findOne({ _id: userID, username });

        if (!authUser) {
            throw new CustomError(
                'User not found! Login or signup to proceed.',
                404
            );
        }

        const { _id, username, email } = authUser;

        const argsWithUser = {
            ...args,
            user: {
                _id,
                username,
                email
            }
        };

        return resolve(parent, argsWithUser, context, info);
    } catch (error) {
        if (error instanceof CustomError) throw error;

        throw new CustomError(
            error.message ?? 'Failed to authenticate the user!',
            500
        );
    }
};

module.exports = authMiddleware;

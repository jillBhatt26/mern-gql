const UserModel = require('../../../models/User');
const { UserInfoType } = require('../../types/users');
const CustomError = require('../../../common/error');

const FetchActiveUser = {
    type: UserInfoType,
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            const activeUserInfo = await UserModel.findOne({
                _id: session.userID,
                username: session.username
            });

            if (!activeUserInfo) throw new CustomError('User not found!', 404);

            const { _id, email, username } = activeUserInfo;

            return { _id, email, username };
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to fetch active user!',
                400
            );
        }
    }
};

module.exports = {
    FetchActiveUser
};

const { UserInfoType } = require('../../types/users');
const CustomError = require('../../../common/error');

const FetchActiveUser = {
    type: UserInfoType,
    resolve: (parent, args, context) => {
        if (!context.req) {
            throw new CustomError('Context setup error!', 401);
        }

        const {
            req: { session }
        } = context;

        if (!session.userID || !session.username) {
            throw new CustomError('You need to login first!', 401);
        }
    }
};

module.exports = {
    FetchActiveUser
};

const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { hash: hashPassword, verify: verifyPassword } = require('argon2');
const UserModel = require('../../../models/User');
const CustomError = require('../../../common/error');
const {
    LoginUserInputType,
    SignupUserInputType,
    UserIDType,
    UserInfoType,
    UpdateUserInputType
} = require('../../types/users');

const SignupUser = {
    type: UserInfoType,
    args: {
        signupUserInput: {
            type: new GraphQLNonNull(SignupUserInputType)
        }
    },
    resolve: async (parent, args, context) => {
        const {
            req: { session }
        } = context;

        if (session.userID || session.username)
            throw new CustomError('You are already logged in!', 400);

        const {
            signupUserInput: { username, email, password }
        } = args;

        if (!username || !email || !password) {
            throw new CustomError('Please provide all user details!', 400);
        }

        try {
            const userWithGivenDetails = await UserModel.findOne({
                $or: [{ username }, { email }]
            });

            if (userWithGivenDetails)
                throw new CustomError('Username or email unavailable!', 400);

            const hashedPassword = await hashPassword(password, {
                hashLength: 32,
                parallelism: 1,
                memoryCost: 1024,
                timeCose: 4
            });

            const newUser = await UserModel.create({
                username,
                email,
                password: hashedPassword
            });

            context.req.session.userID = newUser._id;
            context.req.session.username = newUser.username;

            return newUser;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to signup a new user!',
                500
            );
        }
    }
};

const LoginUser = {
    type: UserInfoType,
    args: {
        loginUserInput: {
            type: new GraphQLNonNull(LoginUserInputType)
        }
    },
    resolve: (parent, args) => {}
};

const LogoutUser = {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
        id: {
            type: UserIDType
        }
    },
    resolve: (parent, args) => {}
};

const UpdateUser = {
    type: UserInfoType,
    args: {
        updateUserInput: {
            type: new GraphQLNonNull(UpdateUserInputType)
        }
    },
    resolve: (parent, args) => {}
};

module.exports = {
    SignupUser,
    LoginUser,
    LogoutUser,
    UpdateUser
};

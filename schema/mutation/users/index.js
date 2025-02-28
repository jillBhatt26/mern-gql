const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { hash: hashPassword, verify: verifyPassword } = require('argon2');
const UserModel = require('../../../models/User');
const CustomError = require('../../../common/error');
const {
    LoginUserInputType,
    SignupUserInputType,
    UserInfoType,
    UpdateUserInputType
} = require('../../types/users');

const destroySession = session =>
    new Promise((resolve, reject) => {
        session.destroy(error => {
            if (error) {
                return reject(error.message);
            }

            return resolve(true);
        });
    });

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
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (session.userID && session.username) {
                throw new CustomError('You are already logged in!', 400);
            }

            const {
                loginUserInput: {
                    username: inputUsername,
                    email: inputEmail,
                    password: inputPassword
                }
            } = args;

            if (!inputUsername && !inputEmail) {
                throw new CustomError(
                    'Either username or email is required to login',
                    400
                );
            }

            if (!inputPassword) {
                throw new CustomError('Password is required to login', 400);
            }

            const userToLogin = await UserModel.findOne({
                $or: [{ username: inputUsername }, { email: inputEmail }]
            });

            if (!userToLogin) {
                throw new CustomError(
                    'User not found! You need to signup first!',
                    404
                );
            }

            const isPasswordCorrect = await verifyPassword(
                userToLogin.password,
                inputPassword
            );

            if (!isPasswordCorrect) {
                throw new CustomError('Incorrect password!', 400);
            }
            const { _id, username, email } = userToLogin;

            session.userID = _id;
            session.username = username;

            return {
                _id,
                username,
                email
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to login the user!',
                500
            );
        }
    }
};

const LogoutUser = {
    type: GraphQLBoolean,
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            let isUserLoggedOut = await destroySession(session);

            return isUserLoggedOut;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to logout the user!',
                500
            );
        }
    }
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

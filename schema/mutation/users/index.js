const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { hash: hashPassword, verify: verifyPassword } = require('argon2');
const UserModel = require('../../../models/User');
const CustomError = require('../../../shared/CustomError');
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
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            const {
                updateUserInput: {
                    username: inputUsername,
                    email: inputEmail,
                    password: inputPassword
                }
            } = args;

            const detailsToUpdate = {};

            if (inputUsername) {
                const userWithInputUsername = await UserModel.findOne({
                    username: inputUsername
                });

                if (userWithInputUsername)
                    throw new CustomError('New username already in use!', 400);

                detailsToUpdate.username = inputUsername;
            }

            if (inputEmail) {
                const userWithInputEmail = await UserModel.findOne({
                    email: inputEmail
                });

                if (userWithInputEmail)
                    throw new CustomError('New email already in use!', 400);

                detailsToUpdate.email = inputEmail;
            }

            if (inputPassword) {
                const hashedPassword = await hashPassword(inputPassword, {
                    hashLength: 32,
                    parallelism: 1,
                    memoryCost: 1024,
                    timeCose: 4
                });

                detailsToUpdate.password = hashedPassword;
            }

            const { userID } = session;

            await destroySession(session);

            const updatedUser = await UserModel.findByIdAndUpdate(
                userID,
                {
                    $set: detailsToUpdate
                },
                { new: true }
            );

            const { _id, username, email } = updatedUser;

            return {
                _id,
                username,
                email
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to update the user!',
                500
            );
        }
    }
};

const DeleteUser = {
    type: new GraphQLNonNull(GraphQLBoolean),
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            const userToDelete = await UserModel.findByIdAndDelete(
                session.userID
            );

            if (!userToDelete) {
                throw new CustomError('User not deleted!', 400);
            }

            const isLoggedOut = await destroySession(session);

            return isLoggedOut;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to delete the user!',
                500
            );
        }
    }
};

module.exports = {
    SignupUser,
    LoginUser,
    LogoutUser,
    UpdateUser,
    DeleteUser
};

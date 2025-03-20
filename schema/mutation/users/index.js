const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { hash: hashPassword, verify: verifyPassword } = require('argon2');
const UserModel = require('../../../models/User');
const TodosModel = require('../../../models/Todo');
const ImagesModel = require('../../../models/Image');
const CustomError = require('../../../common/CustomError');
const CloudStorage = require('../../../common/CloudStorage');
const {
    LoginUserInputType,
    SignupUserInputType,
    UserInfoType,
    UpdateUserInputType
} = require('../../types/users');
const { TOTAL_DOC_LIMIT } = require('../../../config/constants');

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
        try {
            const totalUserDocs = await UserModel.countDocuments({});

            if (totalUserDocs >= TOTAL_DOC_LIMIT)
                throw new CustomError('Signup new user limit reached!', 400);

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
                loginUserInput: { usernameOrEmail, password: inputPassword }
            } = args;

            if (!usernameOrEmail) {
                throw new CustomError(
                    'Either username or email is required to login',
                    400
                );
            }

            if (!inputPassword) {
                throw new CustomError('Password is required to login', 400);
            }

            const userToLogin = await UserModel.findOne({
                $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
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
                req: { session },
                res
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            let isUserLoggedOut = await destroySession(session);

            res.clearCookie('connect.sid');

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
                req: {
                    session: { userID, username }
                }
            } = context;

            if (!userID || !username) {
                throw new CustomError('You need to login first!', 401);
            }

            const {
                updateUserInput: {
                    username: inputUsername,
                    email: inputEmail,
                    password: inputPassword
                }
            } = args;

            // first check if user exists
            const userToUpdate = await UserModel.findOne({
                _id: userID,
                username
            });

            if (!userToUpdate) {
                throw new CustomError('User to update not found!', 404);
            }

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

            await destroySession(context.req.session);

            const updatedUser = await UserModel.findByIdAndUpdate(
                userID,
                {
                    $set: detailsToUpdate
                },
                { new: true }
            );

            const {
                _id,
                username: updatedUsername,
                email: updatedEmail
            } = updatedUser;

            return {
                _id,
                username: updatedUsername,
                email: updatedEmail
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
                req: { session },
                res
            } = context;

            if (!session.userID || !session.username) {
                throw new CustomError('You need to login first!', 401);
            }

            // check if user to be deleted exists
            const userToBeDeleted = await UserModel.findById(session.userID);

            if (!userToBeDeleted)
                throw new CustomError('User to be deleted not found!', 404);

            const isLoggedOut = await destroySession(session);

            // Delete all the todos and Images of the user to be deleted first
            await Promise.all([
                new CloudStorage().deleteFolderAndFiles(session.userID),
                TodosModel.deleteMany({ userID: session.userID }),
                ImagesModel.deleteMany({ userID: session.userID })
            ]);

            const deletedUser = await UserModel.findByIdAndDelete(
                session.userID
            );

            if (!deletedUser) {
                throw new CustomError('User not deleted!', 400);
            }

            res.clearCookie('connect.sid');

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

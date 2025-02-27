const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
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
    resolver: (parent, args) => {}
};

const LoginUser = {
    type: UserInfoType,
    args: {
        loginUserInput: {
            type: new GraphQLNonNull(LoginUserInputType)
        }
    },
    resolver: (parent, args) => {}
};

const LogoutUser = {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
        id: {
            type: UserIDType
        }
    },
    resolver: (parent, args) => {}
};

const UpdateUser = {
    type: UserInfoType,
    args: {
        updateUserInput: {
            type: new GraphQLNonNull(UpdateUserInputType)
        }
    },
    resolver: (parent, args) => {}
};

module.exports = {
    SignupUser,
    LoginUser,
    LogoutUser,
    UpdateUser
};

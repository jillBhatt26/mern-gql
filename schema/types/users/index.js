const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType
} = require('graphql');

const UserIDType = new GraphQLNonNull(GraphQLString);

const UserType = new GraphQLObjectType({
    name: 'UserType',
    fields: {
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const SignupUserInputType = new GraphQLInputObjectType({
    name: 'SignupUserInputType',
    fields: {
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const LoginUserInputType = new GraphQLInputObjectType({
    name: 'LoginUserInputType',
    fields: {
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const UpdateUserInputType = new GraphQLInputObjectType({
    name: 'UpdateUserInputType',
    fields: {
        username: {
            type: GraphQLString
        },
        email: {
            type: GraphQLString
        },
        password: {
            type: GraphQLString
        }
    }
});

const UserInfoType = new GraphQLObjectType({
    name: 'UserInfoType',
    fields: {
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

module.exports = {
    UserIDType,
    UserType,
    UserInfoType,
    LoginUserInputType,
    SignupUserInputType,
    UpdateUserInputType
};

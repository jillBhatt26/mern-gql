const {
    GraphQLString,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLInputObjectType
} = require('graphql');
const CustomError = require('../../../common/CustomError');
const TodosModel = require('../../../models/Todo');
const { Todos } = require('../todos');

const UserIDType = new GraphQLNonNull(GraphQLString);

const UserInfoType = new GraphQLObjectType({
    name: 'UserInfoType',
    fields: {
        _id: {
            type: UserIDType
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        },
        todos: {
            type: Todos,
            resolve: async parent => {
                try {
                    const todos = await TodosModel.find({ userID: parent._id });

                    return todos;
                } catch (error) {
                    if (error instanceof CustomError) throw error;

                    throw new CustomError('Failed to fetch user todos!', 500);
                }
            }
        }
    }
});

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
        usernameOrEmail: {
            type: new GraphQLNonNull(GraphQLString)
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

module.exports = {
    UserIDType,
    UserType,
    UserInfoType,
    LoginUserInputType,
    SignupUserInputType,
    UpdateUserInputType
};

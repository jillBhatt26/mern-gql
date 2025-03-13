const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList,
    GraphQLInputObjectType
} = require('graphql');
const CustomError = require('../../../common/CustomError');
const UserModel = require('../../../models/User');

const todoID = new GraphQLNonNull(GraphQLID);

const EnumTodoStatus = new GraphQLEnumType({
    name: 'EnumTodoStatus',
    values: {
        PENDING: {
            value: 'pending'
        },
        PROGRESS: {
            value: 'progress'
        },
        COMPLETE: {
            value: 'complete'
        }
    }
});

const TodoUserInfo = new GraphQLObjectType({
    name: 'TodoUserInfo',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        username: {
            type: new GraphQLNonNull(GraphQLString)
        },
        email: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const Todo = new GraphQLObjectType({
    name: 'Todo',
    fields: {
        id: {
            type: todoID
        },
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: new GraphQLNonNull(GraphQLString)
        },
        status: {
            type: EnumTodoStatus
        },
        user: {
            type: new GraphQLNonNull(TodoUserInfo),
            resolve: async parent => {
                try {
                    const user = await UserModel.findById(parent.userID, {
                        password: 0
                    });

                    const { _id, email, username } = user;

                    return {
                        _id,
                        email,
                        username
                    };
                } catch (error) {
                    if (error instanceof CustomError) throw error;

                    throw new CustomError(
                        'Failed to fetch user details from task!',
                        500
                    );
                }
            }
        }
    }
});

const Todos = new GraphQLNonNull(new GraphQLList(Todo));

const CreateTodoInput = new GraphQLInputObjectType({
    name: 'CreateTodoInput',
    fields: {
        name: {
            type: new GraphQLNonNull(GraphQLString)
        },
        description: {
            type: new GraphQLNonNull(GraphQLString)
        },
        status: {
            type: new GraphQLNonNull(EnumTodoStatus),
            defaultValue: 'pending'
        }
    }
});

const UpdateTodoInput = new GraphQLInputObjectType({
    name: 'UpdateTodoInput',
    fields: {
        id: {
            type: todoID
        },
        name: {
            type: GraphQLString
        },
        description: {
            type: GraphQLString
        },
        status: {
            type: EnumTodoStatus
        }
    }
});

module.exports = {
    EnumTodoStatus,
    todoID,
    Todo,
    Todos,
    CreateTodoInput,
    UpdateTodoInput
};

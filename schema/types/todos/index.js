const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList
} = require('graphql');

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
        }
    }
});

const Todos = new GraphQLList(Todo);

module.exports = {
    EnumTodoStatus,
    todoID,
    Todo,
    Todos
};

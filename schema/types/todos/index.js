const {
    GraphQLID,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLEnumType,
    GraphQLList,
    GraphQLInputObjectType
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

const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const TodoModel = require('../../../models/Todo');
const {
    CreateTodoInput,
    UpdateTodoInput,
    Todo,
    todoID
} = require('../../types/todos');

const CreateTodo = {
    type: new GraphQLNonNull(Todo),
    args: {
        createTodoInput: {
            type: new GraphQLNonNull(CreateTodoInput)
        }
    },
    resolve: async (parent, args) => {
        const {
            createTodoInput: { name, description, status }
        } = args;

        const newTodo = await TodoModel.create({
            name,
            description,
            status
        });

        return newTodo;
    }
};

const UpdateTodo = {
    type: Todo,
    args: {
        updateTodoInput: {
            type: new GraphQLNonNull(UpdateTodoInput)
        }
    },
    resolve: async (parents, args) => {
        const {
            updateTodoInput: { id, name, description, status }
        } = args;

        const updatedTodo = await TodoModel.findByIdAndUpdate(
            id,
            {
                $set: {
                    name,
                    description,
                    status
                }
            },
            { new: true }
        );

        return updatedTodo;
    }
};

const DeleteTodo = {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
        id: {
            type: todoID
        }
    },
    resolve: async (parents, args) => {
        await TodoModel.findByIdAndDelete(args.id);

        return true;
    }
};

module.exports = {
    CreateTodo,
    UpdateTodo,
    DeleteTodo
};

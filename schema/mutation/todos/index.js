const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const TodoModel = require('../../../models/Todo');
const CustomError = require('../../../common/CustomError');
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
        try {
            const {
                createTodoInput: { name, description, status }
            } = args;

            if (!name || !description) {
                throw new CustomError(
                    'Please provide name and description of new todo!',
                    400
                );
            }

            const newTodo = await TodoModel.create({
                name,
                description,
                status
            });

            return newTodo;
        } catch (error) {
            throw new CustomError(
                error.message ?? 'Failed to create new task!',
                500
            );
        }
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

        try {
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
        } catch (error) {
            throw new CustomError(
                error.message ?? 'Failed to update the task!',
                500
            );
        }
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
        try {
            await TodoModel.findByIdAndDelete(args.id);

            return true;
        } catch (error) {
            throw new CustomError(
                error.message ?? 'Failed to delete the task!',
                500
            );
        }
    }
};

module.exports = {
    CreateTodo,
    UpdateTodo,
    DeleteTodo
};

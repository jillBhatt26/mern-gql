const TodoModel = require('../../../models/Todo');
const { todoID, Todo, Todos } = require('../../types/todos');
const CustomError = require('../../../common/CustomError');

const todosQuery = {
    type: Todos,
    resolve: async () => {
        try {
            const todos = await TodoModel.find({});

            return todos;
        } catch (error) {
            throw new CustomError(
                error.message ?? 'Failed to fetch tasks!',
                500
            );
        }
    }
};

const todoQuery = {
    type: Todo,
    args: {
        id: {
            type: todoID
        }
    },
    resolve: async (parent, args) => {
        try {
            const todo = await TodoModel.findById(args.id);

            if (!todo) {
                throw new CustomError('Task not found', 404);
            }

            return todo;
        } catch (error) {
            throw new CustomError(
                error.message ?? 'Failed to fetch the task!',
                500
            );
        }
    }
};

module.exports = {
    todosQuery,
    todoQuery
};

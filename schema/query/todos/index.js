const TodoModel = require('../../../models/Todo');
const { todoID, Todo, Todos } = require('../../types/todos');
const CustomError = require('../../../common/CustomError');

const todosQuery = {
    type: Todos,
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const { userID } = session;

            const todos = await TodoModel.find({ userID });

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
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

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

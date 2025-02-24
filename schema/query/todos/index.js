const TodoModel = require('../../../models/Todo');
const { todoID, Todo, Todos } = require('../../types/todos');

const todosQuery = {
    type: Todos,
    resolve: async () => {
        const todos = await TodoModel.find({});

        return todos;
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
        const todo = await TodoModel.findById(args.id);

        return todo;
    }
};

module.exports = {
    todosQuery,
    todoQuery
};

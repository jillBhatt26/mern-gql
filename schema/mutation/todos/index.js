const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const TodoModel = require('../../../models/Todo');
const { TOTAL_DOC_LIMIT } = require('../../../config/constants');
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
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const totalDocs = await TodoModel.countDocuments();

            if (totalDocs >= TOTAL_DOC_LIMIT)
                throw new CustomError(
                    'Total documents create limit reached!',
                    400
                );

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
                status,
                userID: session.userID
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
    resolve: async (parents, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const {
                updateTodoInput: { id, name, description, status }
            } = args;

            const todoToUpdate = await TodoModel.findById(id);

            if (!todoToUpdate)
                throw new CustomError('Task to update not found!', 404);

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
    resolve: async (parents, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const todoToDelete = await TodoModel.findById(args.id);

            if (!todoToDelete)
                throw new CustomError('Task to delete not found!', 404);

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

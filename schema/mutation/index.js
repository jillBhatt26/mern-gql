const { GraphQLObjectType } = require('graphql');
const { CreateTodo, UpdateTodo, DeleteTodo } = require('./todos');
const { UploadFile } = require('./files');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        CreateTodo,
        UpdateTodo,
        DeleteTodo,
        UploadFile
    }
});

module.exports = mutation;

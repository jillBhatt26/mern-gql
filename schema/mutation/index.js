const { GraphQLObjectType } = require('graphql');
const { CreateTodo, UpdateTodo, DeleteTodo } = require('./todos');
const { UploadFile } = require('./files');
const { LoginUser, LogoutUser, SignupUser, UpdateUser } = require('./users');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        CreateTodo,
        UpdateTodo,
        DeleteTodo,
        UploadFile,
        LoginUser,
        LogoutUser,
        SignupUser,
        UpdateUser
    }
});

module.exports = mutation;

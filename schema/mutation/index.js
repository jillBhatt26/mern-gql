const { GraphQLObjectType } = require('graphql');
const { CreateTodo, UpdateTodo, DeleteTodo } = require('./todos');
const { UploadImage, DeleteImage } = require('./files');
const {
    LoginUser,
    LogoutUser,
    SignupUser,
    UpdateUser,
    DeleteUser
} = require('./users');

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        CreateTodo,
        UpdateTodo,
        DeleteTodo,
        UploadImage,
        DeleteImage,
        LoginUser,
        LogoutUser,
        SignupUser,
        UpdateUser,
        DeleteUser
    }
});

module.exports = mutation;

const fs = require('fs');
const path = require('path');
const { GraphQLSchema, printSchema } = require('graphql');
const { applyMiddleware } = require('graphql-middleware');
const { GraphQLUpload } = require('graphql-upload');
const mutation = require('./mutation');
const query = require('./query');
const rules = require('./rules');
const { ImageType } = require('./types/images');
const {
    CreateTodoInput,
    EnumTodoStatus,
    Todo,
    Todos,
    UpdateTodoInput,
    todoID
} = require('./types/todos');
const {
    LoginUserInputType,
    SignupUserInputType,
    UpdateUserInputType,
    UserIDType,
    UserInfoType,
    UserType
} = require('./types/users');

const schema = new GraphQLSchema({
    query,
    mutation,
    types: [
        // images
        ImageType,

        // todos
        CreateTodoInput,
        EnumTodoStatus,
        Todo,
        Todos,
        UpdateTodoInput,
        todoID,

        // users
        LoginUserInputType,
        SignupUserInputType,
        UpdateUserInputType,
        UserIDType,
        UserInfoType,
        UserType
    ],
    scalars: {
        Upload: GraphQLUpload
    }
});

const schemaWithMiddleware = applyMiddleware(schema, ...rules);

const sdl = printSchema(schemaWithMiddleware);
fs.writeFileSync(path.resolve(__dirname, 'schema.graphql'), sdl);

module.exports = schemaWithMiddleware;

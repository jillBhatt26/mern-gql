const { GraphQLObjectType } = require('graphql');
const hello = require('./hello');
const { todosQuery, todoQuery } = require('./todos');
const { FetchActiveUser } = require('./users');
const { FetchUserImagesQuery, FetchUserImage } = require('./images');

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello,
        todos: todosQuery,
        todo: todoQuery,
        FetchActiveUser,
        FetchUserImagesQuery,
        FetchUserImage
    }
});

module.exports = query;

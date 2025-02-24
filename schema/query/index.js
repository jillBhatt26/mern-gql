const { GraphQLObjectType } = require('graphql');
const hello = require('./hello');
const { todosQuery, todoQuery } = require('./todos');

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello,
        todos: todosQuery,
        todo: todoQuery
    }
});

module.exports = query;

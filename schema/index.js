const {
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLSchema,
    GraphQLString
} = require('graphql');

const query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: () => {
                return 'Hello world!!';
            }
        }
    }
});

const schema = new GraphQLSchema({
    query
});

module.exports = schema;

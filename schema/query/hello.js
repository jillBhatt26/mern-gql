const { GraphQLNonNull, GraphQLString } = require('graphql');

const hello = {
    type: new GraphQLNonNull(GraphQLString),
    resolve: () => {
        return 'Hello World!!';
    }
};

module.exports = hello;

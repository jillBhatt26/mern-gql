const { GraphQLSchema } = require('graphql');
const { applyMiddleware } = require('graphql-middleware');
const { GraphQLUpload } = require('graphql-upload');
const mutation = require('./mutation');
const query = require('./query');
const rules = require('./rules');
const { FileType } = require('./types/files');

const schema = new GraphQLSchema({
    query,
    mutation,
    types: [FileType],
    scalars: {
        Upload: GraphQLUpload
    }
});

const schemaWithMiddleware = applyMiddleware(
    schema,
    // All middleware here...
    ...rules
);

module.exports = schemaWithMiddleware;

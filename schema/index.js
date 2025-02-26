const { GraphQLSchema } = require('graphql');
const query = require('./query');
const mutation = require('./mutation');
const { FileType } = require('./types/files');
const { GraphQLUpload } = require('graphql-upload');

const schema = new GraphQLSchema({
    query,
    mutation,
    types: [FileType],
    scalars: {
        Upload: GraphQLUpload
    }
});

module.exports = schema;

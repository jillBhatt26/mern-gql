const fs = require('fs');
const path = require('path');
const { GraphQLSchema, printSchema } = require('graphql');
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

const sdl = printSchema(schemaWithMiddleware);
fs.writeFileSync(path.resolve(__dirname, 'schema.graphql'), sdl);

module.exports = schemaWithMiddleware;

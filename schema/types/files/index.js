const {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLScalarType
} = require('graphql');
const { GraphQLUpload } = require('graphql-upload');

const UploadFileType = new GraphQLNonNull(new GraphQLScalarType(GraphQLUpload));

const FileType = new GraphQLObjectType({
    name: 'File',
    fields: {
        filename: { type: new GraphQLNonNull(GraphQLString) },
        mimetype: { type: new GraphQLNonNull(GraphQLString) },
        encoding: { type: new GraphQLNonNull(GraphQLString) }
    }
});

module.exports = {
    FileType,
    UploadFileType
};

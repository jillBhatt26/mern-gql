const {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLScalarType,
    GraphQLID,
    GraphQLInputObjectType
} = require('graphql');
const { GraphQLUpload } = require('graphql-upload');

const UploadFileType = new GraphQLNonNull(new GraphQLScalarType(GraphQLUpload));

const FileType = new GraphQLObjectType({
    name: 'FileType',
    fields: {
        filename: {
            type: new GraphQLNonNull(GraphQLString)
        },
        mimetype: {
            type: new GraphQLNonNull(GraphQLString)
        },
        encoding: {
            type: new GraphQLNonNull(GraphQLString)
        },
        newFileName: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const ImagesURLInfo = new GraphQLObjectType({
    name: 'ImagesURLInfo',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        filename: {
            type: new GraphQLNonNull(GraphQLString)
        },
        cloudImageID: {
            type: new GraphQLNonNull(GraphQLID)
        },
        url: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

const DeleteImageInput = new GraphQLInputObjectType({
    name: 'DeleteImageInput',
    fields: {
        cloudImageID: {
            type: new GraphQLNonNull(GraphQLID)
        },
        cloudImageName: {
            type: new GraphQLNonNull(GraphQLString)
        }
    }
});

module.exports = {
    FileType,
    UploadFileType,
    ImagesURLInfo,
    DeleteImageInput
};

const {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
    GraphQLScalarType,
    GraphQLID,
    GraphQLInputObjectType
} = require('graphql');
const { GraphQLUpload } = require('graphql-upload');

const UploadImageType = new GraphQLNonNull(
    new GraphQLScalarType(GraphQLUpload)
);

const imageID = new GraphQLNonNull(GraphQLID);

const ImageType = new GraphQLObjectType({
    name: 'ImageType',
    fields: {
        _id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        cloudImageID: {
            type: new GraphQLNonNull(GraphQLID)
        },
        filename: {
            type: new GraphQLNonNull(GraphQLString)
        },
        mimetype: {
            type: new GraphQLNonNull(GraphQLString)
        },
        encoding: {
            type: new GraphQLNonNull(GraphQLString)
        },
        cloudImageName: {
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
        cloudImageName: {
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

const FetchImageInput = new GraphQLInputObjectType({
    name: 'FetchImageInput',
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
    ImageType,
    imageID,
    UploadImageType,
    ImagesURLInfo,
    DeleteImageInput,
    FetchImageInput
};

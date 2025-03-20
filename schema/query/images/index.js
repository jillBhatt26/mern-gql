const { GraphQLList, GraphQLNonNull } = require('graphql');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const ImagesModel = require('../../../models/Image');
const {
    ImagesURLInfo,
    FetchImageInput,
    imageID
} = require('../../types/images');

const FetchUserImagesQuery = {
    type: new GraphQLNonNull(new GraphQLList(ImagesURLInfo)),
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const userImages = await ImagesModel.find({
                userID: session.userID
            }).sort({
                createdAt: -1
            });

            const cloudStorage = new CloudStorage();

            const imagesInfo = await Promise.all(
                userImages.map(
                    async ({ _id, cloudImageName, cloudImageID }) => {
                        const { signedUrl } = await cloudStorage.fetch(
                            `${session.userID}/${cloudImageName}`
                        );

                        return {
                            _id,
                            cloudImageID,
                            cloudImageName,
                            url: signedUrl
                        };
                    }
                )
            );

            return imagesInfo;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to fetch user images!',
                500
            );
        }
    }
};

const FetchUserImage = {
    type: ImagesURLInfo,
    args: {
        id: {
            type: imageID
        }
    },
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const image = await ImagesModel.findById(args.id);

            if (!image)
                throw new CustomError('Requested image not found!', 404);

            const { signedUrl: imageSignedURL } =
                await new CloudStorage().fetch(
                    `${session.userID}/${image.cloudImageName}`
                );

            return {
                _id: image._id,
                cloudImageID: image.cloudImageID,
                cloudImageName: image.cloudImageName,
                url: imageSignedURL
            };
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError(
                error.message ?? 'Failed to fetch requested user image!',
                500
            );
        }
    }
};

module.exports = {
    FetchUserImagesQuery,
    FetchUserImage
};

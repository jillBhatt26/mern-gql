const { GraphQLList, GraphQLNonNull } = require('graphql');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const ImagesModel = require('../../../models/Image');
const { ImagesURLInfo, FetchImageInput } = require('../../types/images');

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
        fetchImageInput: {
            type: new GraphQLNonNull(FetchImageInput)
        }
    },
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            if (!session || !session.userID || !session.username)
                throw new CustomError('You need to login first!', 401);

            const { cloudImageName, cloudImageID } = args.fetchImageInput;

            if (!cloudImageName || !cloudImageID)
                throw new CustomError(
                    'Incomplete image details provided!',
                    400
                );

            const userImage = await ImagesModel.findOne({
                cloudImageName,
                cloudImageID,
                userID: session.userID
            });

            if (!userImage)
                throw new CustomError('Requested image not found!', 404);

            const { signedUrl: imageSignedURL } =
                await new CloudStorage().fetch(
                    `${session.userID}/${cloudImageName}`
                );

            return {
                _id: userImage._id,
                cloudImageID,
                cloudImageName,
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

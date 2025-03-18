const { GraphQLList, GraphQLNonNull } = require('graphql');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const ImagesModel = require('../../../models/Image');
const { ImagesURLInfo } = require('../../types/images');

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

module.exports = {
    FetchUserImagesQuery
};

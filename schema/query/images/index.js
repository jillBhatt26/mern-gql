const { GraphQLList, GraphQLNonNull } = require('graphql');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const ImagesModel = require('../../../models/Image');
const { ImagesURLInfo } = require('../../types/files');

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
                userImages.map(async img => {
                    const { signedUrl } = await cloudStorage.fetch(
                        `${session.userID}/${img.cloudImageName}`
                    );

                    return {
                        _id: img._id,
                        cloudImageID: img.cloudImageID,
                        filename: img.cloudImageName,
                        url: signedUrl
                    };
                })
            );

            return imagesInfo;
        } catch (error) {
            if (error instanceof CustomError) throw error;

            throw new CustomError('Failed to fetch user images!', 500);
        }
    }
};

module.exports = {
    FetchUserImagesQuery
};

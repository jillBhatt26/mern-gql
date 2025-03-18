// const fs = require('fs');
const path = require('path');
const { GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { GraphQLUpload } = require('graphql-upload');
const { finished } = require('stream/promises');
const { v4: uuidV4 } = require('uuid');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const { TOTAL_DOC_LIMIT } = require('../../../config/constants');
const ImagesModel = require('../../../models/Image');
const { FileType, DeleteImageInput } = require('../../types/files');

// const pathToUploadsDir = path.resolve(
//     __dirname,
//     '../',
//     '../',
//     '../',
//     'uploads'
// );

const UploadImage = {
    type: FileType,
    args: {
        file: { type: GraphQLUpload }
    },
    resolve: async (parent, { file }, context) => {
        try {
            const {
                req: { session }
            } = context;

            const { userID, username } = session;

            if (!userID || !username)
                throw new CustomError('You need to login first!', 401);

            const totalUserImages = await ImagesModel.countDocuments({
                userID
            });

            if (totalUserImages >= TOTAL_DOC_LIMIT)
                throw new CustomError(
                    'Alloted storage full! Clear some images to add new.',
                    400
                );

            const { createReadStream, filename, mimetype, encoding } =
                await file;

            const ext = path.extname(filename);

            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];

            if (!allowedExts.includes(ext)) {
                throw new CustomError('Unsupported file type provided', 400);
            }

            const newFileName = `${uuidV4()}${ext}`;

            // const uploadFileDest = path.resolve(pathToUploadsDir, newFileName);

            // const out = fs.createWriteStream(uploadFileDest);

            // createReadStream().pipe(out);
            // await finished(out);

            const chunks = [];

            const stream = createReadStream();

            for await (const chunk of stream) {
                chunks.push(chunk);
            }

            await finished(stream);

            const fileToUpload = new File(chunks, newFileName, {
                type: `image/${ext}`
            });

            // NOTE: This will create a new folder if not exists named <userID>
            const { id: cloudImageID } = await new CloudStorage().uploadFile(
                userID,
                fileToUpload,
                newFileName
            );

            // fs.unlinkSync(uploadFileDest);

            await ImagesModel.create({
                cloudImageName: newFileName,
                cloudImageID,
                userID
            });

            return { filename, mimetype, encoding, newFileName };
        } catch (error) {
            if (error instanceof CustomError) return error;

            return new CustomError(
                error.message ?? 'Failed to upload file!',
                500
            );
        }
    }
};

const DeleteImage = {
    type: new GraphQLNonNull(GraphQLBoolean),
    args: {
        deleteImageInput: {
            type: new GraphQLNonNull(DeleteImageInput)
        }
    },
    resolve: async (parent, args, context) => {
        try {
            const {
                req: { session }
            } = context;

            const { userID, username } = session;

            if (!userID || !username)
                throw new CustomError('You need to login first!', 401);

            const {
                deleteImageInput: { cloudImageID, cloudImageName }
            } = args;

            const deletedImages = await new CloudStorage().delete(
                userID,
                cloudImageName
            );

            if (deletedImages.length <= 0) return false;

            await ImagesModel.findOneAndDelete({
                userID,
                cloudImageID,
                cloudImageName
            });

            return true;
        } catch (error) {
            if (error instanceof CustomError) return error;

            return new CustomError(
                error.message ?? 'Failed to delete file!',
                500
            );
        }
    }
};

module.exports = {
    UploadImage,
    DeleteImage
};

const fs = require('fs');
const path = require('path');
const { GraphQLUpload } = require('graphql-upload');
const { finished } = require('stream/promises');
const { v4: uuidV4 } = require('uuid');
const CloudStorage = require('../../../common/CloudStorage');
const CustomError = require('../../../common/CustomError');
const { FileType } = require('../../types/files');

const pathToUploadsDir = path.resolve(
    __dirname,
    '../',
    '../',
    '../',
    'uploads'
);

const UploadFile = {
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

            const { createReadStream, filename, mimetype, encoding } =
                await file;

            const ext = path.extname(filename);

            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];

            if (!allowedExts.includes(ext)) {
                throw new CustomError('Unsupported file type provided', 400);
            }

            const newFileName = `${uuidV4()}${ext}`;

            const uploadFileDest = path.resolve(pathToUploadsDir, newFileName);

            const out = fs.createWriteStream(uploadFileDest);

            createReadStream().pipe(out);
            await finished(out);

            // NOTE: This will create a new folder if not exists named <userID>
            await new CloudStorage().upload(userID, newFileName);

            fs.unlinkSync(uploadFileDest);

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

module.exports = {
    UploadFile
};

const fs = require('fs');
const path = require('path');
const { GraphQLUpload } = require('graphql-upload');
const { finished } = require('stream/promises');
const { v4: uuidV4 } = require('uuid');
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
    resolve: async (parent, { file }) => {
        try {
            const { createReadStream, filename, mimetype, encoding } =
                await file;

            const ext = path.extname(filename);

            const allowedExts = ['.jpg', '.jpeg', '.png', '.gif'];

            if (!allowedExts.includes(ext)) {
                throw new Error('Unsupported file type provided');
            }

            const newFileName = `${uuidV4()}${ext}`;

            const uploadFileDest = path.resolve(pathToUploadsDir, newFileName);

            const out = fs.createWriteStream(uploadFileDest);

            createReadStream().pipe(out);
            await finished(out);

            return { filename, mimetype, encoding };
        } catch (error) {
            return new Error(error.message ?? 'Failed to upload file!');
        }
    }
};

module.exports = {
    UploadFile
};

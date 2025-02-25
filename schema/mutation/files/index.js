const fs = require('fs');
const path = require('path');
const { GraphQLNonNull } = require('graphql');
const { finished } = require('stream/promises');
const { FileType, UploadFileType } = require('../../types/files');

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
        file: {
            type: UploadFileType
        }
    },
    resolve: async (parent, { file }) => {
        const { filename, mimetype, encoding, createReadStream } = file;

        const uploadFilePath = path.resolve(pathToUploadsDir, filename);

        const writeStream = fs.createWriteStream(uploadFilePath);
        createReadStream().pipe(writeStream);
        await finished(writeStream);

        return {
            filename,
            mimetype,
            encoding
        };
    }
};

module.exports = {
    UploadFile
};

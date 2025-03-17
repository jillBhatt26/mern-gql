const fs = require('fs');
const path = require('path');
const { imageBucket, supabase } = require('../config/supabase');
const { SIGNED_URL_TIMEOUT } = require('../config/constants');
const CustomError = require('./CustomError');

class CloudStorage {
    pathToUploads = path.resolve(__dirname, '../', 'uploads');

    getFile = filename =>
        new Promise(async (resolve, reject) => {
            try {
                const chunks = [];

                const filePath = path.resolve(this.pathToUploads, filename);

                const readStream = fs.createReadStream(filePath, {
                    encoding: null
                });

                for await (const chunk of readStream) {
                    chunks.push(chunk);
                }

                const fileExtension = path.extname(filename);

                const file = new File(chunks, filename, {
                    type: `image/${fileExtension}`
                });

                return resolve(file);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(
                    new CustomError('Failed to read the file to upload!', 500)
                );
            }
        });

    upload = (userID, localFilename) =>
        new Promise(async (resolve, reject) => {
            {
                try {
                    const file = await this.getFile(localFilename);

                    const { data, error } = await supabase.storage
                        .from(imageBucket)
                        .upload(`${userID}/${localFilename}`, file);

                    if (error) {
                        throw new CustomError(
                            error.message ?? 'File upload failed!',
                            error.code ?? 500
                        );
                    }

                    resolve(data);
                } catch (error) {
                    if (error instanceof CustomError) return reject(error);

                    return reject(new CustomError('File upload failed!', 500));
                }
            }
        });

    fetch = (filename, signedUrlTimeout = SIGNED_URL_TIMEOUT) =>
        new Promise(async (resolve, reject) => {
            try {
                const { data, error } = await supabase.storage
                    .from(imageBucket)
                    .createSignedUrl(filename, signedUrlTimeout);

                if (error)
                    throw new CustomError(
                        error.message ?? 'File fetch failed!',
                        error.code ?? 500
                    );

                return resolve(data);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(new CustomError('File fetch failed!', 500));
            }
        });

    delete = filename =>
        new Promise(async (resolve, reject) => {
            try {
                const { data, error } = await supabase.storage
                    .from(imageBucket)
                    .remove([filename]);

                if (error)
                    throw new CustomError(
                        error.message ?? 'File delete failed!',
                        error.code ?? 500
                    );

                return resolve(data);
            } catch (error) {
                if (error instanceof CustomError) return reject(error);

                return reject(new CustomError('File delete failed!', 500));
            }
        });
}

module.exports = CloudStorage;

const { connect, connection } = require('mongoose');
const { DB_URL } = require('../config/env');

const connectMongoDB = async (url = '') => {
    try {
        const conn = await connect(url.length > 0 ? url : DB_URL);

        return conn;
    } catch (error) {
        throw new Error(
            error.message ?? 'Failed to connect with MongoDB database!'
        );
    }
};

const disconnectMongoDB = async () => {
    try {
        await connection.close();

        return true;
    } catch (error) {
        throw new Error(
            error.message ?? 'Failed to disconnect with MongoDB database!'
        );
    }
};

module.exports = {
    connectMongoDB,
    disconnectMongoDB
};

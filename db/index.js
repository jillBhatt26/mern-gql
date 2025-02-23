const { connect } = require('mongoose');
const { DB_URL } = require('../config/env');

const connectMongoDB = async () => {
    try {
        const conn = await connect(DB_URL);

        return conn;
    } catch (error) {
        throw new Error(
            error.message ?? 'Failed to connect with MongoDB database!'
        );
    }
};

module.exports = {
    connectMongoDB
};

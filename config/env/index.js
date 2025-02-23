require('dotenv/config');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL ?? '';

module.exports = {
    NODE_ENV,
    PORT,
    DB_URL
};

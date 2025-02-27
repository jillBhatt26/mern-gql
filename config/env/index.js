require('dotenv/config');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'shhhhh!!!';

module.exports = {
    NODE_ENV,
    PORT,
    DB_URL,
    SESSION_SECRET
};

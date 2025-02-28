require('dotenv/config');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'shhhhh!!!';
const FE_URL = process.env.FE_URL ?? 'http://localhost:5000/graphql';

module.exports = {
    NODE_ENV,
    PORT,
    DB_URL,
    SESSION_SECRET,
    FE_URL
};

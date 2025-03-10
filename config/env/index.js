require('dotenv/config');

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const PORT = process.env.PORT ?? 5000;
const DB_URL = process.env.DB_URL ?? '';
const TEST_DB_URL = process.env.TEST_DB_URL ?? '';
const SESSION_SECRET = process.env.SESSION_SECRET ?? 'shhhhh!!!';
const INTROSPECTION_URL =
    process.env.INTROSPECTION_URL ?? 'http://localhost:5000/graphql';
const FE_URL = process.env.FE_URL ?? 'http://localhost:3000';

module.exports = {
    NODE_ENV,
    PORT,
    DB_URL,
    TEST_DB_URL,
    SESSION_SECRET,
    INTROSPECTION_URL,
    FE_URL
};

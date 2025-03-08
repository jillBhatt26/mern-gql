const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const UserModel = require('../../models/User');

describe('USERS MUTATION SUITE', () => {
    let conn;
    let app;

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp(TEST_DB_URL);
    });

    describe('QUERY FetchActiveUser', () => {
        it('Should return active user', async () => {});
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        // await conn.connection.dropCollection('users');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

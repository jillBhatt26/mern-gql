const request = require('supertest');
const { hash: hashPassword } = require('argon2');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const UserModel = require('../../models/User');
const ImagesModel = require('../../models/Image');

describe('IMAGE QUERY TESTS SUITE', () => {
    let app;
    let conn;
    let cookie;
    let loggedInUserID;

    const generateUserToSignup = async (
        username = 'user1',
        email = 'user1@email.com',
        password = 'password1'
    ) => {
        const hashedPassword = await hashPassword(password);

        const userToSignup = {
            username,
            email,
            password: hashedPassword
        };

        return userToSignup;
    };

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp(TEST_DB_URL);
    });

    beforeEach(async () => {
        userToSignup = await generateUserToSignup();

        await UserModel.create(userToSignup);

        const loginQuery = `
                            mutation LoginUser {
                                LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password1"}) {
                                    _id
                                }
                            }
                        `;

        expect(userToSignup).toBeDefined();

        const loginRes = await request(app)
            .post(API_URL)
            .send({ query: loginQuery });

        expect(loginRes.status).toStrictEqual(200);
        expect(loginRes.body.data.LoginUser).toHaveProperty('_id');
        expect(loginRes.status).toStrictEqual(200);
        expect(loginRes.body.data.LoginUser).toHaveProperty('_id');
        expect(loginRes.header['set-cookie']).toBeDefined();
        expect(loginRes.header['set-cookie'][0]).toContain('connect.sid');

        loggedInUserID = loginRes.body.data.LoginUser._id;

        cookie = loginRes.header['set-cookie'];

        // TODO: Upload the image before running all the tests
    });
    describe('Fetch User Images', () => {
        it('Should fetch all user images', async () => {
            expect(loggedInUserID).toBeDefined();
        });
    });

    describe('Fetch User Image', () => {
        it('Should fetch image by given id', async () => {
            expect(loggedInUserID).toBeDefined();
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await ImagesModel.deleteMany({});
    });

    afterAll(async () => {
        // await conn.connection.dropCollection('images');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

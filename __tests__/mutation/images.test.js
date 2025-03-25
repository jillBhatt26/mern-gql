const path = require('path');
const { hash: hashPassword } = require('argon2');
const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL, TOTAL_DOC_LIMIT } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const ImagesModel = require('../../models/Image');
const UserModel = require('../../models/User');

describe('IMAGES TEST SUITE', () => {
    let conn;
    let app;
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
    });

    describe('Upload User Image', () => {
        it('Should check file type', async () => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();

            const query = `
                mutation UploadImage($image: Upload!) {
                    UploadImage(image: $image) {
                        _id
                        encoding
                        mimetype
                        filename
                        cloudImageID
                        cloudImageName
                    }
                }
            `;

            const response = await request(app)
                .post(API_URL)
                .set('Content-Type', 'multipart/form-data')
                .set('Cookie', cookie)
                .field('query', JSON.stringify({ query }))
                .field('variables', JSON.stringify({ file: null }))
                .attach(
                    'image',
                    path.resolve(__dirname, '../', 'files', 'testPPT.pptx')
                );

            expect(response.status).toBe(400);
        });

        it('Should check file size', async () => {});

        it('Should check if user is authenticated', async () => {});
    });

    describe('Delete User Image', () => {});

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

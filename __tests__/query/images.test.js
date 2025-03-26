const path = require('path');
const request = require('supertest');
const { hash: hashPassword } = require('argon2');
const initExpressApolloApp = require('../../app');
const CloudStorage = require('../../common/CloudStorage');
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
    let uploadedImageID;

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

        const uploadQuery = `
            mutation UploadImage($image: Upload!) {
                UploadImage(image: $image) {
                    _id
                }
            }
        `;

        const imagePath = path.resolve(__dirname, '../', 'files', 'test.jpg');

        const uploadResponse = await request(app)
            .post(API_URL)
            .set('Cookie', cookie)
            .set('Content-Type', 'multipart/form-data')
            .set('x-apollo-operation-name', 'UploadImage')
            .set('apollo-require-preflight', true)
            .field(
                'operations',
                JSON.stringify({
                    query: uploadQuery,
                    variables: { image: null }
                })
            )
            .field('map', JSON.stringify({ 0: ['variables.image'] }))
            .attach('0', imagePath);

        expect(uploadResponse.status).toBe(200);
        expect(uploadResponse.body.data.UploadImage._id).toBeDefined();

        uploadedImageID = uploadResponse.body.data.UploadImage._id;
    });
    describe('Fetch User Images', () => {
        it('Should fetch all user images', async () => {
            expect(loggedInUserID).toBeDefined();
            expect(uploadedImageID).toBeDefined();

            const query = `
                query FetchUserImages {
                    FetchUserImagesQuery {
                        _id
                        cloudImageID
                        cloudImageName
                        url
                    }
                }
            `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Content-Type', 'application/json')
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.FetchUserImagesQuery).toBeDefined();
            expect(response.body.data.FetchUserImagesQuery).toHaveLength(1);

            const fetchedImage = response.body.data.FetchUserImagesQuery.pop();

            expect(fetchedImage).toBeDefined();

            expect(fetchedImage._id).toBeDefined();
            expect(fetchedImage.cloudImageID).toBeDefined();
            expect(fetchedImage.cloudImageName).toBeDefined();
            expect(fetchedImage.url).toBeDefined();
        });
    });

    describe('Fetch User Image', () => {
        it('Should fetch image by given id', async () => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();
            expect(uploadedImageID).toBeDefined();

            const query = `
                query FetchUserImage {
                    FetchUserImage (id: "${uploadedImageID}") {
                        _id
                        cloudImageID
                        cloudImageName
                        url
                    }
                }
            `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.FetchUserImage).toBeDefined();

            const userImage = response.body.data.FetchUserImage;

            expect(userImage._id).toBeDefined();
            expect(userImage.cloudImageID).toBeDefined();
            expect(userImage.cloudImageName).toBeDefined();
            expect(userImage.url).toBeDefined();
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await ImagesModel.deleteMany({});
    });

    afterAll(async () => {
        expect(loggedInUserID).toBeDefined();

        await conn.connection.dropCollection('images');
        await new CloudStorage().deleteFolderAndFiles(loggedInUserID);
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

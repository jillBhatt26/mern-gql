const path = require('path');
const { hash: hashPassword } = require('argon2');
const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const CloudStorage = require('../../common/CloudStorage');
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
        beforeEach(() => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();
        });

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

        it('Should validate file size', async () => {
            const filePath = path.resolve(
                __dirname,
                '../',
                'files',
                'large.jpg'
            );

            const response = await request(app)
                .post(API_URL)
                .set('Content-Type', 'multipart/form-data')
                .set('apollo-requires-preflight', true)
                .set('x-apollo-operation-name', 'UploadImage')
                .set('Cookie', cookie)
                .field(
                    'operations',
                    JSON.stringify({ query, variables: { image: null } })
                )
                .field('map', '{"0":["variables.image"]}')
                .attach('0', filePath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('errors');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('UploadImage', null);

            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message:
                            'File truncated as it exceeds the 1000000 byte size limit.'
                    }
                ])
            );
        });

        it('Should validate file size', async () => {
            const filePath = path.resolve(
                __dirname,
                '../',
                'files',
                'testPPT.pptx'
            );

            const response = await request(app)
                .post(API_URL)
                .set('Content-Type', 'multipart/form-data')
                .set('apollo-requires-preflight', true)
                .set('x-apollo-operation-name', 'UploadImage')
                .set('Cookie', cookie)
                .field(
                    'operations',
                    JSON.stringify({ query, variables: { image: null } })
                )
                .field('map', '{"0":["variables.image"]}')
                .attach('0', filePath);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('errors');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('UploadImage', null);

            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Unsupported file type provided'
                    }
                ])
            );
        });

        it('Should upload an image file type with allowed dimensions', async () => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();

            const filePath = path.resolve(
                __dirname,
                '../',
                'files',
                'test.jpg'
            );

            const response = await request(app)
                .post(API_URL)
                .set('Content-Type', 'multipart/form-data')
                .set('apollo-requires-preflight', true)
                .set('x-apollo-operation-name', 'UploadImage')
                .set('Cookie', cookie)
                .field(
                    'operations',
                    JSON.stringify({ query, variables: { image: null } })
                )
                .field('map', '{"0":["variables.image"]}')
                .attach('0', filePath);

            expect(response.status).toBe(200);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toHaveProperty('UploadImage');
            expect(response.body.data.UploadImage).toHaveProperty('_id');
            expect(response.body.data.UploadImage).toHaveProperty('encoding');
            expect(response.body.data.UploadImage).toHaveProperty('mimetype');
            expect(response.body.data.UploadImage).toHaveProperty('filename');
            expect(response.body.data.UploadImage).toHaveProperty(
                'cloudImageName'
            );
            expect(response.body.data.UploadImage).toHaveProperty(
                'cloudImageID'
            );
        });
    });

    describe('Delete User Image', () => {
        beforeEach(() => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();
        });

        it('Should validate user authentication before deleting image', async () => {
            const uploadQuery = `
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

            const filePath = path.resolve(
                __dirname,
                '../',
                'files',
                'test.jpg'
            );

            const uploadResponse = await request(app)
                .post(API_URL)
                .set('Content-Type', 'multipart/form-data')
                .set('apollo-requires-preflight', true)
                .set('x-apollo-operation-name', 'UploadImage')
                .set('Cookie', cookie)
                .field(
                    'operations',
                    JSON.stringify({
                        query: uploadQuery,
                        variables: { image: null }
                    })
                )
                .field('map', '{"0":["variables.image"]}')
                .attach('0', filePath);

            expect(uploadResponse.status).toBe(200);

            /**
             * uploadResponse.body:  {
[1]       data: {
[1]         UploadImage: {
[1]           _id: '67e447c204b4b41aabbc10c5',
[1]           encoding: '7bit',
[1]           mimetype: 'image/jpeg',
[1]           filename: 'test.jpg',
[1]           cloudImageID: 'd970b247-25ba-4d8e-8a62-d88327a5b260',
[1]           cloudImageName: '5ad1afd7-0f02-4a4c-a17a-5082c966ae36.jpg'
[1]         }
[1]       }
[1]     }
             */

            const deleteQuery = `
                mutation DeleteImage {
                    DeleteImage (id: "${uploadResponse.body.data.UploadImage._id}")
                }
            `;

            const response = await request(app)
                .post(API_URL)
                .send({ query: deleteQuery })
                .set('Cookie', cookie);

            expect(response.status).toBe(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toBeDefined();
            expect(response.body.data.DeleteImage).toStrictEqual(true);
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await ImagesModel.deleteMany({});

        await new CloudStorage().deleteFolderAndFiles(loggedInUserID);
    });

    afterAll(async () => {
        await conn.connection.dropCollection('images');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

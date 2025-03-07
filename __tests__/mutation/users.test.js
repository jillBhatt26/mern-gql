const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL, TOTAL_DOC_LIMIT } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const UserModel = require('../../models/User');

describe('USERS MUTATION SUITE', () => {
    let conn;
    let app;

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp(TEST_DB_URL);
    });

    describe('MUTATION SignupUser', () => {
        it('Should not signup a new user with missing values', async () => {
            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { email: "user1@email.com", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(400);
            expect(response.body.data).toBeUndefined();
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message:
                            'Field "SignupUserInputType.username" of required type "String!" was not provided.'
                    }
                ])
            );
        });

        it('Should not signup a new user with empty values', async () => {
            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "", email: "user1@email.com", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('SignupUser');
            expect(response.body.data.SignupUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Please provide all user details!'
                    }
                ])
            );
        });

        it('Should not signup a new user if username is taken', async () => {
            await UserModel.create({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "user1", email: "user1@email.com", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('SignupUser');
            expect(response.body.data.SignupUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Username or email unavailable!'
                    }
                ])
            );
        });

        it('Should not signup a new user if email is taken', async () => {
            await UserModel.create({
                username: 'user1',
                email: 'user1@email.com',
                password: 'password1'
            });

            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "user2", email: "user1@email.com", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('SignupUser');
            expect(response.body.data.SignupUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Username or email unavailable!'
                    }
                ])
            );
        });

        it('Should sign up a new user', async () => {
            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "user1", email: "user1@email.com", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toHaveProperty('SignupUser');

            expect(response.header['set-cookie']).toBeDefined();
            expect(response.header['set-cookie'][0]).toContain('connect.sid');

            expect(response.body.data.SignupUser).toHaveProperty('_id');
            expect(response.body.data.SignupUser).toHaveProperty(
                'username',
                'user1'
            );
            expect(response.body.data.SignupUser).toHaveProperty(
                'email',
                'user1@email.com'
            );
            expect(response.body.data.SignupUser).not.toHaveProperty(
                'password'
            );
        });

        it('Should not sign up a new user if a user is already logged in after sign up', async () => {
            let cookie;

            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "user1", email: "user1@email.com", password: "password1" }) {
                        _id
                    }
                }
            `;

            const firstSignupRes = await request(app)
                .post(API_URL)
                .send({ query });

            expect(firstSignupRes.status).toStrictEqual(200);
            expect(firstSignupRes.body.data).toHaveProperty('SignupUser');

            expect(firstSignupRes.header['set-cookie']).toBeDefined();
            expect(firstSignupRes.header['set-cookie'][0]).toContain(
                'connect.sid'
            );

            expect(firstSignupRes.body.data.SignupUser).toHaveProperty('_id');

            cookie = firstSignupRes.headers['set-cookie'];

            const secondSignUpRes = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            console.log('body: ', secondSignUpRes.body);

            expect(secondSignUpRes.status).toStrictEqual(200);
            expect(secondSignUpRes.body.data).toHaveProperty('SignupUser');
            expect(secondSignUpRes.body.data.SignupUser).toBeNull();
            expect(secondSignUpRes.body).toHaveProperty('errors');
            expect(secondSignUpRes.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'You are already logged in!'
                    }
                ])
            );
        });
    });

    describe('MUTATION LoginUser', () => {
        it('Should log an existing user in', async () => {});
    });

    describe('MUTATION LogoutUser', () => {
        it('Should log out an authenticated user', async () => {});
    });

    describe('MUTATION UpdateUser', () => {
        it('Should update an authenticated user', async () => {});
    });

    describe('MUTATION DeleteUser', () => {
        it('Should delete an authenticated user', async () => {});
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

const request = require('supertest');
const { hash: hashPassword } = require('argon2');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL, TOTAL_DOC_LIMIT } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const UserModel = require('../../models/User');

describe('USERS MUTATION SUITE', () => {
    let conn;
    let app;
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

        it(`Should only allow ${TOTAL_DOC_LIMIT} users to sign up`, async () => {
            await UserModel.insertMany(
                await Promise.all(
                    Array(TOTAL_DOC_LIMIT)
                        .fill(0)
                        .map((_, idx) => idx + 1)
                        .map(async item => {
                            const userToSignup = await generateUserToSignup(
                                `user${item}`,
                                `user${item}@email.com`,
                                `password${item}`
                            );

                            return userToSignup;
                        })
                )
            );

            const query = `
                mutation Signup {
                    SignupUser (signupUserInput: { username: "testUser1", email: "testUser1@email.com", password: "password1" }) {
                        _id
                    }
                }
            `;

            const firstSignupRes = await request(app)
                .post(API_URL)
                .send({ query });

            expect(firstSignupRes.status).toStrictEqual(200);
            expect(firstSignupRes.body.data).toHaveProperty('SignupUser');
            expect(firstSignupRes.body.data.SignupUser).toBeNull();

            expect(firstSignupRes.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Signup new user limit reached!'
                    }
                ])
            );
        });
    });

    describe('MUTATION LoginUser', () => {
        let userToSignup;

        beforeEach(async () => {
            userToSignup = await generateUserToSignup();

            await UserModel.create(userToSignup);
        });

        it('Should not perform login with missing values', async () => {
            const query = `
                mutation Login {
                    LoginUser (loginUserInput: { usernameOrEmail: "" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(400);
            expect(response.body).toHaveProperty('errors');
            expect(response.body.data).toBeUndefined();
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message:
                            'Field "LoginUserInputType.password" of required type "String!" was not provided.'
                    }
                ])
            );
        });

        it('Should not perform login with empty values', async () => {
            const query = `
                mutation Login {
                    LoginUser (loginUserInput: { usernameOrEmail: "", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('LoginUser');
            expect(response.body.data.LoginUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Either username or email is required to login'
                    }
                ])
            );
        });

        it('Should validate if user exists', async () => {
            const query = `
                mutation Login {
                    LoginUser (loginUserInput: { usernameOrEmail: "user2", password: "password1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('LoginUser');
            expect(response.body.data.LoginUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'User not found! You need to signup first!'
                    }
                ])
            );
        });

        it('Should validate if password is correct', async () => {
            const query = `
                mutation Login {
                    LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password2" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('LoginUser');
            expect(response.body.data.LoginUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'Incorrect password!'
                    }
                ])
            );
        });

        it('Should log an existing user in', async () => {
            const query = `
                mutation LoginUser {
                    LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password1"}) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            expect(userToSignup).toBeDefined();

            const response = await request(app).post(API_URL).send({ query });

            // status assertions
            expect(response.status).toStrictEqual(200);

            // body assertions
            expect(response.body).toHaveProperty('data');
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toHaveProperty('LoginUser');
            expect(response.body.data.LoginUser).toHaveProperty('_id');
            expect(response.body.data.LoginUser).not.toHaveProperty('password');

            const { username, email } = response.body.data.LoginUser;

            expect(username).toStrictEqual(userToSignup.username);
            expect(email).toStrictEqual(userToSignup.email);

            // headers assertions for cookies
            expect(response.headers['set-cookie']).toBeDefined();
            expect(response.headers['set-cookie'][0]).toContain('connect.sid');
        });

        it('Should not log in an already authenticated user', async () => {
            let cookie;

            const query = `
                mutation LoginUser {
                    LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password1"}) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            expect(userToSignup).toBeDefined();

            const firstLoginRes = await request(app)
                .post(API_URL)
                .send({ query });

            // status assertions
            expect(firstLoginRes.status).toStrictEqual(200);

            // body assertions
            expect(firstLoginRes.body).toHaveProperty('data');
            expect(firstLoginRes.body.errors).toBeUndefined();
            expect(firstLoginRes.body.data).toHaveProperty('LoginUser');
            expect(firstLoginRes.body.data.LoginUser).toHaveProperty('_id');
            expect(firstLoginRes.body.data.LoginUser).not.toHaveProperty(
                'password'
            );

            const { username, email } = firstLoginRes.body.data.LoginUser;

            expect(username).toStrictEqual(userToSignup.username);
            expect(email).toStrictEqual(userToSignup.email);

            // headers assertions for cookies
            expect(firstLoginRes.headers['set-cookie']).toBeDefined();
            expect(firstLoginRes.headers['set-cookie'][0]).toContain(
                'connect.sid'
            );

            cookie = firstLoginRes.headers['set-cookie'];

            const secondLoginRes = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(secondLoginRes.status).toStrictEqual(200);
            expect(secondLoginRes.body).toHaveProperty('data');
            expect(secondLoginRes.body.data).toHaveProperty('LoginUser');
            expect(secondLoginRes.body.data.LoginUser).toBeNull();
            expect(secondLoginRes.body).toHaveProperty('errors');
            expect(secondLoginRes.body.errors).toStrictEqual(
                expect.arrayContaining([
                    { message: 'You are already logged in!' }
                ])
            );
        });
    });

    describe('MUTATION LogoutUser', () => {
        let userToSignup;

        beforeEach(async () => {
            userToSignup = await generateUserToSignup();

            await UserModel.create(userToSignup);
        });

        it('Should check authentication status before log out', async () => {
            const query = `
                mutation Logout {
                    LogoutUser
                }
            `;

            expect(userToSignup).toBeDefined();

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('LogoutUser');
            expect(response.body.data.LogoutUser).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'You need to login first!'
                    }
                ])
            );
        });

        it('Should log out an authenticated user', async () => {
            let cookie;

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

            cookie = loginRes.header['set-cookie'];

            const logoutQuery = `
                mutation LogoutUser {
                    LogoutUser
                }
            `;

            const logoutRes = await request(app)
                .post(API_URL)
                .send({ query: logoutQuery })
                .set('Cookie', cookie);

            expect(logoutRes.status).toStrictEqual(200);
            expect(logoutRes.body.data.errors).toBeUndefined();
            expect(logoutRes.body.data.LogoutUser).toStrictEqual(true);
        });
    });

    describe('MUTATION UpdateUser', () => {
        let cookie;
        let loggedInUser;

        beforeEach(async () => {
            userToSignup = await generateUserToSignup();

            await UserModel.create(userToSignup);

            const loginQuery = `
                mutation LoginUser {
                    LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password1"}) {
                        _id,
                        username,
                        email
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

            cookie = loginRes.header['set-cookie'];
            loggedInUser = loginRes.body.data.LoginUser;
        });

        it('Should not update an unauthenticated user', async () => {
            const query = `
                mutation UpdateUser {
                    UpdateUser (updateUserInput: { username: "updateUser1", email: "updateUser1@email.com", password: "updatePassword1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toHaveProperty('UpdateUser');
            expect(response.body.data.UpdateUser).toBeNull();
            expect(response.body.errors).toBeDefined();
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'You need to login first!'
                    }
                ])
            );
        });

        it('Should only update the details provided', async () => {
            const query = `
                mutation UpdateUser {
                    UpdateUser (updateUserInput: { username: "updateUser1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            expect(loggedInUser).toBeDefined();
            expect(cookie).toBeDefined();

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.UpdateUser).toBeDefined();

            const { _id, username, email } = response.body.data.UpdateUser;

            expect(_id).toStrictEqual(loggedInUser._id);
            expect(username).not.toEqual(loggedInUser.username);
            expect(email).toStrictEqual(loggedInUser.email);
        });

        it('Should update all the details provided', async () => {
            const query = `
                mutation UpdateUser {
                    UpdateUser (updateUserInput: { username: "updateUser1", email: "updateUser1@email.com", password: "updatePassword1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            expect(loggedInUser).toBeDefined();
            expect(cookie).toBeDefined();

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data.UpdateUser).toBeDefined();

            const { _id, username, email } = response.body.data.UpdateUser;

            expect(_id).toStrictEqual(loggedInUser._id);
            expect(username).not.toEqual(loggedInUser.username);
            expect(email).not.toStrictEqual(loggedInUser.email);
        });

        it('Should terminate the session once updated', async () => {
            const updateUserQuery = `
                mutation UpdateUser {
                    UpdateUser (updateUserInput: { username: "updateUser1", email: "updateUser1@email.com", password: "updatePassword1" }) {
                        _id,
                        username,
                        email
                    }
                }
            `;

            expect(loggedInUser).toBeDefined();
            expect(cookie).toBeDefined();

            const updateUserResponse = await request(app)
                .post(API_URL)
                .send({ query: updateUserQuery })
                .set('Cookie', cookie);

            expect(updateUserResponse.status).toStrictEqual(200);
            expect(updateUserResponse.body.errors).toBeUndefined();
            expect(updateUserResponse.body.data.UpdateUser).toBeDefined();

            // NOTE: Fire the same query with / without updated values to see if error prompts to log in again.
            const secondUpdateResponse = await request(app)
                .post(API_URL)
                .send({ query: updateUserQuery })
                .set('Cookie', cookie);

            expect(secondUpdateResponse.status).toStrictEqual(200);
            expect(secondUpdateResponse.body.data.UpdateUser).toBeNull();
            expect(secondUpdateResponse.body.errors).toBeDefined();
            expect(secondUpdateResponse.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'You need to login first!'
                    }
                ])
            );
        });
    });

    describe('MUTATION DeleteUser', () => {
        let cookie;

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

            cookie = loginRes.header['set-cookie'];
        });

        it('Should check if user is authenticated', async () => {
            const query = `
                mutation DeleteUser {
                    DeleteUser
                }
            `;

            expect(userToSignup).toBeDefined();

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toStrictEqual(
                expect.arrayContaining([
                    {
                        message: 'You need to login first!'
                    }
                ])
            );
        });

        it('Should delete an existing and authenticated user', async () => {
            const query = `
                mutation DeleteUser {
                    DeleteUser
                }
            `;

            expect(userToSignup).toBeDefined();

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data.DeleteUser).toStrictEqual(true);
            expect(response.body.errors).toBeUndefined();
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    afterAll(async () => {
        await conn.connection.dropCollection('users');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

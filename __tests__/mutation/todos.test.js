const request = require('supertest');
const { hash: hashPassword } = require('argon2');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL, TOTAL_DOC_LIMIT } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const TodosModel = require('../../models/Todo');
const UserModel = require('../../models/User');

describe('TODOS MUTATIONS SUITE', () => {
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

    describe('MUTATION CreateTodo', () => {
        beforeEach(() => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();
        });

        it(`Should not create more than ${TOTAL_DOC_LIMIT} documents`, async () => {
            await TodosModel.insertMany(
                Array(TOTAL_DOC_LIMIT)
                    .fill(0)
                    .map((_, idx) => idx + 1)
                    .map(item => {
                        return {
                            name: `Todo ${item} name`,
                            description: `Todo ${item} description`,
                            status: `pending`,
                            userID: loggedInUserID
                        };
                    })
            );

            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { name: "Real task", description: "Real task description", status: PENDING }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message: 'Total documents create limit reached!'
                    }
                ])
            );
        });

        it('Should not create todo if input values are missing', async () => {
            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { description: "" }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(400);
            expect(response.body.data).toBeUndefined();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message:
                            'Field "CreateTodoInput.name" of required type "String!" was not provided.'
                    }
                ])
            );
        });

        it('Should not create todo if empty values are provided', async () => {
            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { name: "", description: "" }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message:
                            'Please provide name and description of new todo!'
                    }
                ])
            );
        });

        it('Should not create todo if only one value is provided', async () => {
            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { name: "", description: "Test task 1 description" }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message:
                            'Please provide name and description of new todo!'
                    }
                ])
            );
        });

        it('Should create a new todo with all data provided', async () => {
            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { name: "Test task 1", description: "Test task 1 description", status: PENDING }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.error).toBeUndefined();
            expect(response.body.data).toHaveProperty('CreateTodo');
            expect(response.body.data.CreateTodo).toHaveProperty('id');

            const { name, description, status } = response.body.data.CreateTodo;

            expect(name).toStrictEqual('Test task 1');
            expect(description).toStrictEqual('Test task 1 description');
            expect(status).toStrictEqual('PENDING');
        });

        it('Should create a new todo with default status', async () => {
            const query = `
                    mutation CreateTodo {
                        CreateTodo (createTodoInput: { name: "Test task 2", description: "Test task 2 description"}) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.error).toBeUndefined();
            expect(response.body.data).toHaveProperty('CreateTodo');
            expect(response.body.data.CreateTodo).toHaveProperty('id');

            const { name, description, status } = response.body.data.CreateTodo;

            expect(name).toStrictEqual('Test task 2');
            expect(description).toStrictEqual('Test task 2 description');
            expect(status).toStrictEqual('PENDING');
        });
    });

    describe('MUTATION DeleteTodo', () => {
        let createdTodo;
        const fakeObjectID = '67c9f1fc0bd6317d06a95123';

        beforeEach(async () => {
            const newTodoModel = await TodosModel.create({
                name: 'Test task 1',
                description: 'Test task 1 description',
                userID: loggedInUserID
            });

            expect(newTodoModel).toHaveProperty('_id');
            expect(newTodoModel).toHaveProperty('name', 'Test task 1');
            expect(newTodoModel).toHaveProperty(
                'description',
                'Test task 1 description'
            );
            expect(newTodoModel).toHaveProperty('status', 'pending');

            createdTodo = newTodoModel;
        });

        it('Should check if task to delete exists', async () => {
            const query = `
                    mutation DeleteTodo {
                        DeleteTodo (id: "${fakeObjectID}") 
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message: 'Task to delete not found!'
                    }
                ])
            );
        });

        it('Should find and delete a todo', async () => {
            const query = `
                    mutation DeleteTodo {
                        DeleteTodo (id: "${createdTodo.id}") 
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.error).toBeUndefined();
            expect(response.body.data).toHaveProperty('DeleteTodo');
            expect(response.body.data.DeleteTodo).toBe(true);
        });
    });

    describe('MUTATION UpdateTodo', () => {
        let createdTodo;
        const fakeObjectID = '67c9f1fc0bd6317d06a95123';

        beforeEach(() => {
            expect(loggedInUserID).toBeDefined();
            expect(cookie).toBeDefined();
        });

        beforeEach(async () => {
            const newTodoModel = await TodosModel.create({
                name: 'Test task 1',
                description: 'Test task 1 description',
                userID: loggedInUserID
            });

            expect(newTodoModel).toHaveProperty('_id');
            expect(newTodoModel).toHaveProperty('name', 'Test task 1');
            expect(newTodoModel).toHaveProperty(
                'description',
                'Test task 1 description'
            );
            expect(newTodoModel).toHaveProperty('status', 'pending');

            createdTodo = newTodoModel;
        });

        it('Should should show error if todo is not found', async () => {
            const query = `
                    mutation UpdateTodo {
                        UpdateTodo (updateTodoInput: { id: "${fakeObjectID}", name: "Todo 1 name updated", description: "Todo 1 description updated", status: PROGRESS }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.data.UpdateTodo).toBeNull();
            expect(response.body).toHaveProperty('errors');
            expect(response.body.errors).toEqual(
                expect.arrayContaining([
                    {
                        message: 'Task to update not found!'
                    }
                ])
            );
        });

        it('Should should find and update the todo using the details provided', async () => {
            const query = `
                    mutation UpdateTodo {
                        UpdateTodo (updateTodoInput: { id: "${createdTodo.id}", name: "Todo 1 name updated", description: "Todo 1 description updated", status: PROGRESS }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toHaveProperty('UpdateTodo');

            const { id, name, description, status } =
                response.body.data.UpdateTodo;

            expect(createdTodo.id).toStrictEqual(id);
            expect(name).not.toStrictEqual(createdTodo.name);
            expect(description).not.toStrictEqual(createdTodo.description);
            expect(status).not.toStrictEqual(createdTodo.status);

            expect(name).toStrictEqual('Todo 1 name updated');
            expect(description).toStrictEqual('Todo 1 description updated');
            expect(status).toStrictEqual('PROGRESS');
        });

        it('Should update only the details provided', async () => {
            const query = `
                    mutation UpdateTodo {
                        UpdateTodo (updateTodoInput: { id: "${createdTodo.id}", status: PROGRESS }) {
                            id,
                            name,
                            description,
                            status
                        }
                    }
                `;

            const response = await request(app)
                .post(API_URL)
                .send({ query })
                .set('Cookie', cookie);

            expect(response.status).toStrictEqual(200);
            expect(response.body.errors).toBeUndefined();
            expect(response.body.data).toHaveProperty('UpdateTodo');

            const { id, name, description, status } =
                response.body.data.UpdateTodo;

            expect(createdTodo.id).toStrictEqual(id);
            expect(name).toStrictEqual(createdTodo.name);
            expect(description).toStrictEqual(createdTodo.description);
            expect(status).not.toStrictEqual(createdTodo.status);
            expect(status).toStrictEqual('PROGRESS');
        });
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
        await TodosModel.deleteMany({});
    });

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

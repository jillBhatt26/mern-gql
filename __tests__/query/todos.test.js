const request = require('supertest');
const { hash: hashPassword } = require('argon2');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const TodosModel = require('../../models/Todo');
const UserModel = require('../../models/User');

describe('TODOS QUERY SUITE', () => {
    let conn;
    let app;
    let createdTodo;
    let loggedInUserID;
    let cookie;

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

        expect(userToSignup).toBeDefined();

        await UserModel.create(userToSignup);

        const loginQuery = `
            mutation LoginUser {
                LoginUser (loginUserInput: { usernameOrEmail: "user1", password: "password1"}) {
                    _id
                }
            }
        `;

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

    beforeEach(async () => {
        expect(loggedInUserID).toBeDefined();
        expect(cookie).toBeDefined();

        const newTodoModel = await TodosModel.create({
            name: 'Test task 1',
            description: 'Test task 1 description',
            status: 'pending',
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

    it('Should fetch all todos', async () => {
        const query = `
                query Todos {
                    todos {
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
        expect(response.body.data).toHaveProperty('todos');
        expect(response.body.data.todos).toHaveLength(1);
        expect(response.body.data.todos).toEqual([
            {
                id: createdTodo.id,
                name: createdTodo.name,
                description: createdTodo.description,
                status: createdTodo.status.toUpperCase()
            }
        ]);
    });

    it('Should fetch a given todo', async () => {
        const query = `
                query FetchTodo {
                    todo (id: "${createdTodo.id}") {
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
        expect(response.body.data).toHaveProperty('todo');

        const { id, name, description, status } = response.body.data.todo;

        expect(id).toStrictEqual(createdTodo.id);
        expect(name).toStrictEqual(createdTodo.name);
        expect(description).toStrictEqual(createdTodo.description);
        expect(status).toStrictEqual(createdTodo.status.toUpperCase());
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

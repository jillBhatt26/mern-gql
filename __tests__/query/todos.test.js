const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');

describe('TODOS QUERY SUITE', () => {
    let conn;
    let app;
    let createdTodo;

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp();
    });

    beforeEach(async () => {
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

        const response = await request(app).post(API_URL).send({ query });

        expect(response.status).toStrictEqual(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toHaveProperty('CreateTodo');
        expect(response.body.data.CreateTodo).toHaveProperty('id');

        createdTodo = response.body.data.CreateTodo;

        const { name, description, status } = response.body.data.CreateTodo;

        expect(name).toStrictEqual('Test task 1');
        expect(description).toStrictEqual('Test task 1 description');
        expect(status).toStrictEqual('PENDING');
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

        const response = await request(app).post(API_URL).send({ query });

        expect(response.status).toStrictEqual(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toHaveProperty('todos');
        expect(response.body.data.todos).toHaveLength(1);
        expect(response.body.data.todos).toEqual(
            expect.arrayContaining([createdTodo])
        );
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

        const response = await request(app).post(API_URL).send({ query });

        expect(response.status).toStrictEqual(200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.error).toBeUndefined();
        expect(response.body.data).toHaveProperty('todo');

        const { id, name, description, status } = response.body.data.todo;

        expect(id).toStrictEqual(createdTodo.id);
        expect(name).toStrictEqual(createdTodo.name);
        expect(description).toStrictEqual(createdTodo.description);
        expect(status).toStrictEqual(createdTodo.status);
    });

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

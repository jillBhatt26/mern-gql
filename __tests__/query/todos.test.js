const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const TodosModel = require('../../models/Todo');

describe('TODOS QUERY SUITE', () => {
    let conn;
    let app;
    let createdTodo;

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp(TEST_DB_URL);
    });

    beforeEach(async () => {
        const newTodoModel = await TodosModel.create({
            name: 'Test task 1',
            description: 'Test task 1 description',
            status: 'pending'
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

        const response = await request(app).post(API_URL).send({ query });

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

        const response = await request(app).post(API_URL).send({ query });

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

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

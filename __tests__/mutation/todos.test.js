const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');
const { connectMongoDB, disconnectMongoDB } = require('../../db');
const TodosModel = require('../../models/Todo');

describe('TODOS MUTATIONS SUITE', () => {
    let conn;
    let app;

    beforeAll(async () => {
        conn = await connectMongoDB(TEST_DB_URL);

        app = await initExpressApolloApp();
    });

    describe('MUTATION CreateTodo', () => {
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

            const response = await request(app).post(API_URL).send({ query });

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

            const response = await request(app).post(API_URL).send({ query });

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

            const response = await request(app).post(API_URL).send({ query });

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

            const response = await request(app).post(API_URL).send({ query });

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

            const response = await request(app).post(API_URL).send({ query });

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
                description: 'Test task 1 description'
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

            const response = await request(app).post(API_URL).send({ query });

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

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toStrictEqual(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.error).toBeUndefined();
            expect(response.body.data).toHaveProperty('DeleteTodo');
            expect(response.body.data.DeleteTodo).toBe(true);
        });
    });

    afterAll(async () => {
        await conn.connection.dropCollection('todos');
        await conn.connection.dropDatabase();
        await disconnectMongoDB();
    });
});

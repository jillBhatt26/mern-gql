const request = require('supertest');
const { connectMongoDB } = require('../db');
const initExpressApolloApp = require('../app');
const { TEST_DB_URL } = require('../config/env');
const { API_URL } = require('../config/constants');

describe('SETUP TESTS', () => {
    describe('QUERY Hello', () => {
        let app;
        let conn;

        beforeAll(async () => {
            conn = await connectMongoDB(TEST_DB_URL);

            app = await initExpressApolloApp();
        });

        it('Should query Hello', async () => {
            const query = `
                query Test {
                    hello
                }
            `;

            const response = await request(app).post(API_URL).send({ query });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('hello');
            expect(response.body.data.hello).toStrictEqual('Hello World!!');
        });
    });
});

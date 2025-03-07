const request = require('supertest');
const initExpressApolloApp = require('../../app');
const { TEST_DB_URL } = require('../../config/env');
const { API_URL } = require('../../config/constants');

describe('SETUP TESTS', () => {
    describe('QUERY Hello', () => {
        let app;

        beforeAll(async () => {
            app = await initExpressApolloApp(TEST_DB_URL);
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

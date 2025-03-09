const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const { FE_URL, DB_URL, TEST_DB_URL } = require('../config/env');
const initAppSession = require('../config/session');
const schema = require('../schema');

const initExpressApolloApp = async (session_DB_URL = DB_URL) => {
    const app = express();

    app.use(
        cors({
            origin: [FE_URL, 'https://studio.apollographql.com'],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(initAppSession(session_DB_URL));

    app.use(
        graphqlUploadExpress({
            maxFileSize: 1000000,
            maxFiles: 1
        })
    );

    const apolloServer = new ApolloServer({
        schema,
        introspection: true,
        formatError: error => {
            return {
                message: error.message,
                code: error.code
            };
        },
        csrfPrevention: true,
        cache: 'bounded'
    });

    await apolloServer.start();

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: ({ req, res }) => ({ req, res })
        })
    );

    // NOTE: redirect home page to graphql route and show the introspection tool
    app.get('/', (_, res) => res.status(301).redirect('/graphql'));

    return app;
};

module.exports = initExpressApolloApp;

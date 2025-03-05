const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const { FE_URL } = require('../config/env');
const appSession = require('../config/session');
const schema = require('../schema');

const initExpressApolloApp = async () => {
    const app = express();

    app.use(
        cors({
            origin: [FE_URL],
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type'],
            credentials: true
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(appSession);

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

const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const express = require('express');
const { graphqlUploadExpress } = require('graphql-upload');
const { FE_URL, DB_URL, NODE_ENV } = require('../config/env');
const initAppSession = require('../config/session');
const schema = require('../schema');

const initExpressApolloApp = async (session_DB_URL = DB_URL) => {
    const app = express();

    app.use(
        cors({
            origin: FE_URL,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'apollo-require-preflight'],
            credentials: true
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // NOTE: Most important with the perspective of cookies session on public suffixes.
    if (NODE_ENV === 'production') app.set('trust proxy', 1);

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

    return app;
};

module.exports = initExpressApolloApp;

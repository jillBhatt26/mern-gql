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
            allowedHeaders: ['Content-Type'],
            credentials: true
        })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // NOTE: Most important with the perspective of cookies session on public suffixes.
    if (NODE_ENV === 'production') app.set('trust proxy', 1);

    app.use(initAppSession(session_DB_URL));

    if (NODE_ENV === 'production') {
        app.use(
            express.static(path.resolve(__dirname, '../', 'client', 'dist'))
        );
    }

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

    if (NODE_ENV === 'production')
        app.get('/graphql', (_, res) => {
            return res.status(404).redirect('/error');
        });

    app.use(
        '/graphql',
        expressMiddleware(apolloServer, {
            context: ({ req, res }) => ({ req, res })
        })
    );

    if (NODE_ENV === 'production') {
        app.get('*', (req, res) => {
            res.sendFile(
                path.join(__dirname, '../', 'client', 'dist', 'index.html')
            );
        });
    }

    // NOTE: redirect home page to graphql route and show the introspection tool
    // app.get('/', (_, res) => res.status(301).redirect('/graphql'));

    return app;
};

module.exports = initExpressApolloApp;

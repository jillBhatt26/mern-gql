const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const { graphqlUploadExpress } = require('graphql-upload');
const { applyMiddleware } = require('graphql-middleware');
const { PORT, FE_URL } = require('./config/env');
const appSession = require('./config/session');
const { connectMongoDB } = require('./db');
const schema = require('./schema');

connectMongoDB()
    .then(async conn => {
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

        app.listen(PORT, () => {
            console.log(
                `MongoDB connected on host: ${conn.connection.host}...✅✅✅`
            );
            console.log(`GraphQL server exposed on port: ${PORT}...🚀🚀🚀`);
        });
    })
    .catch(error => {
        console.log(`❌❌...${error}...❌❌❌`);
        process.exit(1);
    });

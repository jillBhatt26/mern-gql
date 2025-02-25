const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { PORT } = require('./config/env');
const { connectMongoDB } = require('./db');
const schema = require('./schema');

connectMongoDB()
    .then(async conn => {
        const app = express();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        const apolloServer = new ApolloServer({
            schema,
            introspection: true,
            formatError: error => {
                return {
                    message: error.message,
                    code: error.code
                };
            }
        });

        await apolloServer.start();

        app.use('/graphql', expressMiddleware(apolloServer));

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

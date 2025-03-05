const initExpressApolloApp = require('./app');
const { PORT } = require('./config/env');
const { connectMongoDB } = require('./db');

connectMongoDB()
    .then(async conn => {
        const app = await initExpressApolloApp();

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

const initExpressApolloApp = require('./app');
const { PORT } = require('./config/env');
const { connectMongoDB } = require('./db');
const CustomError = require('./shared/CustomError');

console.log('CustomError: ', CustomError);

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

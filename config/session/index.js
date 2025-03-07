const session = require('express-session');
const MongoStore = require('connect-mongo');
const { DB_URL, SESSION_SECRET } = require('../env');

const initAppSession = (mongoUrl = DB_URL) => {
    const mongoStore = new MongoStore({
        collectionName: 'sessions',
        mongoUrl
    });

    const appSession = session({
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        store: mongoStore
    });

    return appSession;
};

module.exports = initAppSession;

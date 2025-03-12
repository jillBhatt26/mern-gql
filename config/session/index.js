const session = require('express-session');
const MongoStore = require('connect-mongo');
const {
    DB_URL,
    SESSION_SECRET,
    NODE_ENV,
    SESSION_COOKIE_MAX_AGE
} = require('../env');

const initAppSession = (mongoUrl = DB_URL) => {
    const mongoStore = new MongoStore({
        collectionName: 'sessions',
        mongoUrl
    });

    const appSession = session({
        secret: SESSION_SECRET,
        saveUninitialized: false,
        resave: true,
        store: mongoStore,
        cookie: {
            maxAge: SESSION_COOKIE_MAX_AGE,
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: NODE_ENV === 'production',
            secure: NODE_ENV === 'production'
        }
    });

    return appSession;
};

module.exports = initAppSession;

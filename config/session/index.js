const session = require('express-session');
const MongoStore = require('connect-mongo');
const { DB_URL, SESSION_SECRET, NODE_ENV } = require('../env');

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
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax',
            httpOnly: NODE_ENV === 'production',
            secure: NODE_ENV === 'production' && app.get('trust proxy') === 1
        }
    });

    return appSession;
};

module.exports = initAppSession;

const session = require('express-session');
const MongoStore = require('connect-mongo');
const { DB_URL, SESSION_SECRET } = require('../env');

const mongoStore = new MongoStore({
    collectionName: 'sessions',
    mongoUrl: DB_URL
});

const appSession = session({
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    store: mongoStore
});

module.exports = appSession;

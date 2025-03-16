const API_URL = '/graphql';
const TOTAL_DOC_LIMIT = 10;
const SESSION_COOKIE_MAX_AGE = 1000 * 60 * 60 * 24; // 24 hours
const SIGNED_URL_TIMEOUT = 1000 * 60 * 60; // 1 hour

module.exports = {
    API_URL,
    TOTAL_DOC_LIMIT,
    SESSION_COOKIE_MAX_AGE,
    SIGNED_URL_TIMEOUT
};

module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    verbose: true,
    // moduleFileExtensions: ['js'],
    moduleDirectories: ['node_modules', __dirname],
    testSequencer: './test.sequencer.js',
    // testMatch: ['**/e2e/*.test.js', '**/__tests__/*.test.js']
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js']
};

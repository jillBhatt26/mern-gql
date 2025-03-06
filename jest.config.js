module.exports = {
    testEnvironment: 'node',
    clearMocks: true,
    verbose: true,
    moduleFileExtensions: ['js'],
    moduleDirectories: ['node_modules', './'],
    testSequencer: './test.sequencer.js',
    testMatch: ['**/e2e/*.test.[jt]s?(x)', '**/__tests__/*.test.[jt]s?(x)']
};

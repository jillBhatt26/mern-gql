class TestSequencer {
    sort(pathsToTestFiles) {
        const unit = pathsToTestFiles.filter(p => p.path.includes('__tests__'));
        const e2e = pathsToTestFiles.filter(p => p.path.includes('e2e'));

        return [...unit, ...e2e];
    }

    cacheResults() {
        return [];
    }
}

module.exports = TestSequencer;

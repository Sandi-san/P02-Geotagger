const TestSequencer = require('@jest/test-sequencer').default;

class ExecutionSequencer extends TestSequencer {
    sort(tests) {
        const order = [
            'app.e2e-spec.ts',
            'auth.e2e-spec.ts',
            'user.e2e-spec.ts',
        ];

        //console.log('Tests before sorting:', tests.map((test) => test.path));

        const sortedTests = tests.sort((a, b) => {
            const aIndex = order.indexOf(a.path.split('/').pop());
            const bIndex = order.indexOf(b.path.split('/').pop());
            return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) -
                   (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
        });

        console.log('Tests after sorting:', sortedTests.map((test) => test.path));
        return sortedTests;
    }
}

module.exports = ExecutionSequencer;

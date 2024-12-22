const TestSequencer = require('@jest/test-sequencer').default;
const path = require('path'); // Use `path` for platform-independent handling of paths

class ExecutionSequencer extends TestSequencer {
    sort(tests) {
        const order = [
            'app.e2e-spec.ts',
            'auth.e2e-spec.ts',
            'user.e2e-spec.ts',
            'location.e2e-spec.ts',
        ];

        // Ensure consistent sorting regardless of platform
        const sortedTests = tests.sort((a, b) => {
            const aName = path.basename(a.path); // Extract filename
            const bName = path.basename(b.path); // Extract filename

            const aIndex = order.indexOf(aName);
            const bIndex = order.indexOf(bName);

            // Tests not listed in the order will appear at the end
            return (aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex) - 
                   (bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex);
        });

        console.log('\nRun test files in order:', sortedTests.map((test) => path.basename(test.path)));
        return sortedTests;
    }
}

module.exports = ExecutionSequencer;
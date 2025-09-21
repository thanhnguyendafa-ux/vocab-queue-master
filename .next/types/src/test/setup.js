import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
// Add jest-dom matchers to expect
expect.extend(matchers);
// Cleanup after each test case
afterEach(function () {
    cleanup();
});
//# sourceMappingURL=setup.js.map
import { describe, it, expect } from 'vitest';

import checkUrlExists from '../../src/helpers/checkUrlExists.js';

describe('Test helper checkUrlExists', function () {
    it('should find https://github.com/mborne', async function () {
        expect(await checkUrlExists('https://github.com/mborne')).toBe(true);
    });

    it('should find http://github.com/mborne', async function () {
        expect(await checkUrlExists('http://github.com/mborne')).toBe(true);
    });

    it('should not find https://github.com/mborne/not-found', async function () {
        expect(
            await checkUrlExists('https://github.com/mborne/not-found')
        ).toBe(false);
    }, 5000);
});

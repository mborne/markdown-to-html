import { describe, it, expect } from 'vitest';

import check from '../../src/command/check.js';
import { getSampleDir } from '../helpers.js';

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', async function () {
        const sourceDirPath = getSampleDir('01-default-layout');
        let error: unknown = null;
        try {
            await check(sourceDirPath, { checkExternalLinks: false });
        } catch (e) {
            error = e;
        }
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toMatch(/^Found 2 dead link\(s\)/);
    });

    it('shout not find dead links samples/02-remarkjs', async function () {
        const sourceDirPath = getSampleDir('02-remarkjs');
        await check(sourceDirPath, { checkExternalLinks: false });
    });
});

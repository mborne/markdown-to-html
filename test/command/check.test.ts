import { getSampleDir } from '../helpers';

import { check } from '../../src/command/check';

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', async function () {
        const sourceDirPath = getSampleDir('01-default-layout');
        let expectionThrown = false;
        try {
            await check(sourceDirPath, {
                checkExternalLinks: false,
            });
        } catch (err) {
            expectionThrown = true;
            expect(err).toBeInstanceOf(Error);
            expect(err.message).toContain('Found 2 dead link(s)');
            expect(err.message).toContain('missing-file.md');
        }
        expect(expectionThrown).toBeTruthy();
    });

    it('shout not find dead links samples/02-remarkjs', async function () {
        const sourceDirPath = getSampleDir('02-remarkjs');
        await check(sourceDirPath, {
            checkExternalLinks: false,
        });
    });
});

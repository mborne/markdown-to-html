import { expect } from 'chai';

import { getSampleDir } from '../helpers';

import check from '../../src/command/check.js';

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
            expect(err).to.be.an.instanceOf(Error);
            expect(err.message).to.include('Found 2 dead link(s)');
            expect(err.message).to.include('missing-file.md');
        }
        expect(expectionThrown).to.be.true;
    });

    it('shout not find dead links samples/02-remarkjs', async function () {
        const sourceDirPath = getSampleDir('02-remarkjs');
        await check(sourceDirPath, {
            checkExternalLinks: false,
        });
    });
});

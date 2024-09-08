import { expect } from 'chai';

import check from '../../src/command/check.js';

import helpers from '../helpers.js';

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', async function () {
        const sourceDirPath = helpers.getSampleDir('01-default-layout');
        let error = null;
        try {
            await check(sourceDirPath, {
                checkExternalLinks: false,
            });
        } catch (e) {
            error = e;
        }
        expect(error).to.be.not.null;
        expect(error.message)
            .to.be.a('string')
            .and.satisfy((m) => m.startsWith('Found 2 dead link(s)'));
    });

    it('shout not find dead links samples/02-remarkjs', async function () {
        const sourceDirPath = helpers.getSampleDir('02-remarkjs');
        await check(sourceDirPath, {
            checkExternalLinks: false,
        });
    });
});

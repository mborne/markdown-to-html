const expect = require('chai').expect;
const path = require('path');

const check = require('../../src/command/check');

const SAMPLES_DIR = path.resolve(__dirname + '/../../samples');

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', async function () {
        const sourceDirPath = `${SAMPLES_DIR}/01-default-layout`;
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
        const sourceDirPath = `${SAMPLES_DIR}/02-remarkjs`;
        await check(sourceDirPath, {
            checkExternalLinks: false,
        });
    });
});

const expect = require('chai').expect;

const checkUrlExists = require('../../src/helpers/checkUrlExists');

describe('Test helper checkUrlExists', async function () {
    it('should find https://github.com/mborne', async function () {
        const result = await checkUrlExists('https://github.com/mborne');
        expect(result).to.be.true;
    });

    it('should find http://github.com/mborne', async function () {
        const result = await checkUrlExists('http://github.com/mborne');
        expect(result).to.be.true;
    });

    it('should not find https://github.com/mborne/not-found', async function () {
        const result = await checkUrlExists(
            'https://github.com/mborne/not-found'
        );
        expect(result).to.be.false;
    }).timeout(5000);
});

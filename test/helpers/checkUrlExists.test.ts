import checkUrlExists from '../../src/helpers/checkUrlExists.js';

describe('Test helper/checkUrlExists', function () {
    it('should find https://github.com/mborne', async function () {
        const result = await checkUrlExists('https://github.com/mborne');
        expect(result).toBe(true);
    });

    it('should find http://github.com/mborne', async function () {
        const result = await checkUrlExists('http://github.com/mborne');
        expect(result).toBe(true);
    });

    it('should not find https://github.com/mborne/not-found', async function () {
        const result = await checkUrlExists(
            'https://github.com/mborne/not-found'
        );
        expect(result).toBe(false);
    });
});

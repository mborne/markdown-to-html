const expect = require('chai').expect;

const slugify = require('../../src/helpers/slugify');

describe('test slugify', function () {
    it('should convert spaces to dash', function () {
        const input = 'a great title';
        const expected = 'a-great-title';
        const result = slugify(input);
        expect(result).to.equals(expected);
    });

    it('should convert upper case to lower case', function () {
        const input = 'Magic';
        const expected = 'magic';
        const result = slugify(input);
        expect(result).to.equals(expected);
    });
});

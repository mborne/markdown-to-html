const expect = require('chai').expect;

const slugify = require('../../src/marked/slugify');

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

    // TODO : change behavior to improve (deja-vu would be better)
    it('should convert letters with accents to dash', function () {
        const input = 'Déjà vu';
        const expected = 'd-j-vu';
        const result = slugify(input);
        expect(result).to.equals(expected);
    });
});

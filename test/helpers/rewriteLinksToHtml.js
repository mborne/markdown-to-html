const expect = require('chai').expect;

const rewriteLinksToHtml = require('../../src/helpers/rewriteLinksToHtml');

describe('Test link rewrite to html', function () {
    it('should work with relative links', function () {
        const result = rewriteLinksToHtml('[Something](something.md)', 2);
        const expected = '[Something](something.html)';
        expect(result).to.equals(expected);
    });

    it('should keep fragment in relative links', function () {
        const result = rewriteLinksToHtml('[Something](something.md#title)', 2);
        const expected = '[Something](something.html#title)';
        expect(result).to.equals(expected);
    });

    it('should also keep query string in relative links', function () {
        const result = rewriteLinksToHtml(
            '[Something](something.md?_t=15#title)',
            2
        );
        const expected = '[Something](something.html?_t=15#title)';
        expect(result).to.equals(expected);
    });

    it('should ignore absolute url', function () {
        const result = rewriteLinksToHtml(
            '[Something](https://example.com/something.md)',
            2
        );
        const expected = '[Something](https://example.com/something.md)';
        expect(result).to.equals(expected);
    });
});

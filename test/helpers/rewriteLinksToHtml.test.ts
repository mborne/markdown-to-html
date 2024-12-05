import rewriteLinksToHtml from '../../src/helpers/rewriteLinksToHtml.js';

describe('Test helpers/rewriteLinksToHtml', function () {
    it('should work with relative links', function () {
        const result = rewriteLinksToHtml('[Something](something.md)');
        const expected = '[Something](something.html)';
        expect(result).toEqual(expected);
    });

    it('should keep fragment in relative links', function () {
        const result = rewriteLinksToHtml('[Something](something.md#title)');
        const expected = '[Something](something.html#title)';
        expect(result).toEqual(expected);
    });

    it('should also keep query string in relative links', function () {
        const result = rewriteLinksToHtml(
            '[Something](something.md?_t=15#title)'
        );
        const expected = '[Something](something.html?_t=15#title)';
        expect(result).toEqual(expected);
    });

    it('should ignore absolute url', function () {
        const result = rewriteLinksToHtml(
            '[Something](https://example.com/something.md)'
        );
        const expected = '[Something](https://example.com/something.md)';
        expect(result).toEqual(expected);
    });
});

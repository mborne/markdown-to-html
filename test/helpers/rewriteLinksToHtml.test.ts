import { describe, it, expect } from 'vitest';

import rewriteLinksToHtml from '../../src/helpers/rewriteLinksToHtml.js';

describe('Test link rewrite to html', function () {
    it('should work with relative links', function () {
        expect(rewriteLinksToHtml('[Something](something.md)')).toBe(
            '[Something](something.html)'
        );
    });

    it('should keep fragment in relative links', function () {
        expect(rewriteLinksToHtml('[Something](something.md#title)')).toBe(
            '[Something](something.html#title)'
        );
    });

    it('should also keep query string in relative links', function () {
        expect(
            rewriteLinksToHtml('[Something](something.md?_t=15#title)')
        ).toBe('[Something](something.html?_t=15#title)');
    });

    it('should ignore absolute url', function () {
        expect(
            rewriteLinksToHtml('[Something](https://example.com/something.md)')
        ).toBe('[Something](https://example.com/something.md)');
    });
});

import { describe, it, expect } from 'vitest';

import render from '../../../src/markdown/render.js';

/**
 * Note that the link renderer is exercised through markdown.render as
 * marked renderers require a parser to resolve inline tokens.
 */
describe('test link', function () {
    it('should works for basic case without title', function () {
        expect(render('[Something text](something.html)')).toContain(
            '<a href="something.html">Something text</a>'
        );
    });

    it('should add _blank target for absolute', function () {
        expect(render('[Something text](https://example.com)')).toContain(
            '<a href="https://example.com" target="_blank">Something text</a>'
        );
    });

    it('should works for basic case with title', function () {
        expect(
            render('[Something text](something.html "Something title")')
        ).toContain(
            '<a href="something.html" title="Something title">Something text</a>'
        );
    });

    it('should no more rename .md links to .html for relative path', function () {
        expect(
            render('[Something text](something.md "Something title")')
        ).toContain(
            '<a href="something.md" title="Something title">Something text</a>'
        );
    });

    it('should not rename .md links to .html for absolute path and add target _blank', function () {
        expect(
            render(
                '[markdown-to-html - readme](https://github.com/mborne/markdown-to-html/blob/master/README.md "markdown-to-html")'
            )
        ).toContain(
            '<a href="https://github.com/mborne/markdown-to-html/blob/master/README.md" title="markdown-to-html" target="_blank">markdown-to-html - readme</a>'
        );
    });
});

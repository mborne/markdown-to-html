import link from '../../../src/markdown/renderer/link.js';

describe('Test markdown/renderer/link', function () {
    it('should works for basic case without', function () {
        const result = link({
            href: 'something.html',
            title: null,
            text: 'Something text',
        });
        const expected = '<a href="something.html">Something text</a>';
        expect(result).toEqual(expected);
    });

    it('should add _blank target for absolute', function () {
        const result = link({
            href: 'https://example.com',
            title: null,
            text: 'Something text',
        });
        const expected = '<a href="https://example.com" target="_blank">Something text</a>';
        expect(result).toEqual(expected);
    });

    it('should works for basic case with title', function () {
        const result = link({
            href: 'something.html',
            title: 'Something title',
            text: 'Something text',
        });
        const expected = '<a href="something.html" title="Something title">Something text</a>';
        expect(result).toEqual(expected);
    });

    it('should no more rename .md links to .html for relative path', function () {
        const result = link({
            href: 'something.md',
            title: 'Something title',
            text: 'Something text',
        });
        const expected = '<a href="something.md" title="Something title">Something text</a>';
        expect(result).toEqual(expected);
    });

    it('should not rename .md links to .html for absolute path and add target _blank', function () {
        const result = link({
            href: 'https://github.com/mborne/markdown-to-html/blob/master/README.md',
            title: 'markdown-to-html',
            text: 'markdown-to-html - readme',
        });
        const expected =
            '<a href="https://github.com/mborne/markdown-to-html/blob/master/README.md" title="markdown-to-html" target="_blank">markdown-to-html - readme</a>';
        expect(result).toEqual(expected);
    });
});

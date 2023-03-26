const expect = require('chai').expect;

const link = require('../../../src/markdown/renderer/link');

describe('test link', function () {
    it('should works for basic case without', function () {
        const result = link('something.html', null, 'Something text');
        const expected = '<a href="something.html">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should add _blank target for absolute', function () {
        const result = link('https://example.com', null, 'Something text');
        const expected =
            '<a href="https://example.com" target="_blank">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should works for basic case with title', function () {
        const result = link(
            'something.html',
            'Something title',
            'Something text'
        );
        const expected =
            '<a href="something.html" title="Something title">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should no more rename .md links to .html for relative path', function () {
        const result = link(
            'something.md',
            'Something title',
            'Something text'
        );
        const expected =
            '<a href="something.md" title="Something title">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should not rename .md links to .html for absolute path and add target _blank', function () {
        const result = link(
            'https://github.com/mborne/markdown-to-html/blob/master/README.md',
            'markdown-to-html',
            'markdown-to-html - readme'
        );
        const expected =
            '<a href="https://github.com/mborne/markdown-to-html/blob/master/README.md" title="markdown-to-html" target="_blank">markdown-to-html - readme</a>';
        expect(result).to.equals(expected);
    });
});

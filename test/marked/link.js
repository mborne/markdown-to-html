const expect = require('chai').expect;

const link = require('../../src/marked/link');

describe('test link', function () {
    it('should works for basic case without', function () {
        const result = link(false)('something.html', null, 'Something text');
        const expected = '<a href="something.html">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should works for basic case with title', function () {
        const result = link(false)(
            'something.html',
            'Something title',
            'Something text'
        );
        const expected =
            '<a href="something.html" title="Something title">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should rename .md links to .html for relative path', function () {
        const result = link(true)(
            'something.md',
            'Something title',
            'Something text'
        );
        const expected =
            '<a href="something.html" title="Something title">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should rename .md links to .html for relative path keeping fragments', function () {
        const result = link(true)(
            'something.md#something-else',
            null,
            'Something text'
        );
        const expected =
            '<a href="something.html#something-else">Something text</a>';
        expect(result).to.equals(expected);
    });

    it('should not rename .md links to .html for absolute path and add target _blank', function () {
        const result = link(true)(
            'https://github.com/mborne/markdown-to-html/blob/master/README.md',
            'markdown-to-html',
            'markdown-to-html - readme'
        );
        const expected =
            '<a href="https://github.com/mborne/markdown-to-html/blob/master/README.md" title="markdown-to-html" target="_blank">markdown-to-html - readme</a>';
        expect(result).to.equals(expected);
    });
});

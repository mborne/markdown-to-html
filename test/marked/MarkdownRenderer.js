const expect = require('chai').expect;

const MarkdownRenderer = require('../../src/marked/MarkdownRenderer');

describe('test MarkdownRenderer', function () {
    describe('test heading', function () {
        const renderer = new MarkdownRenderer();
        it('should invoke slugify', function () {
            const result = renderer.heading('a great title', 2);
            const expected =
                '<h2 id="a-great-title"><a href="#a-great-title" class="anchor"></a>a great title</h2>';
            expect(result).to.equals(expected);
        });
    });
});

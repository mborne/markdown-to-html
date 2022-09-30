const expect = require('chai').expect;

const marked = require('marked').marked;
const slugger = new marked.Slugger();

const heading = require('../../src/marked/heading');

describe('test heading', function () {
    it('should invoke slugify', function () {
        const result = heading('a great title', 2, 'a great title', slugger);
        const expected =
            '<h2 id="a-great-title"><a href="#a-great-title" class="anchor"></a>a great title</h2>';
        expect(result).to.equals(expected);
    });

    it('should invoke support custom id', function () {
        const result = heading(
            'a great title {#my-id}',
            2,
            'a great title {#my-id}',
            slugger
        );
        const expected =
            '<h2 id="my-id"><a href="#my-id" class="anchor"></a>a great title</h2>';
        expect(result).to.equals(expected);
    });
});

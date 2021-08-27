const expect = require('chai').expect;

const heading = require('../../src/marked/heading');

describe('test heading', function () {
    it('should invoke slugify', function () {
        const result = heading('a great title', 2);
        const expected =
            '<h2 id="a-great-title"><a href="#a-great-title" class="anchor"></a>a great title</h2>';
        expect(result).to.equals(expected);
    });
});

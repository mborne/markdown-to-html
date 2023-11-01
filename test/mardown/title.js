const expect = require('chai').expect;

const title = require('../../src/markdown/title');

const helpers = require('../helpers');
const fs = require('fs');

describe('Regress test for markdown.title', function () {
    it('should extract h1 title for sample-1.md', function () {
        const result = title(helpers.getTestDataContent('sample-1.md'));
        const expected = 'Main title ignored by toc';
        expect(result).to.equals(expected);
    });

    it('should extract null title for sample-no-h1.md', function () {
        const result = title(helpers.getTestDataContent('sample-no-h1.md'));
        const expected = null;
        expect(result).to.equals(expected);
    });
});

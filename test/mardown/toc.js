const expect = require('chai').expect;

const toc = require('../../src/markdown/toc');

const helpers = require('../helpers');
const fs = require('fs');

describe('Regress test for markdown.toc', function () {
    it('should produce expected markdown for sample-1.md', function () {
        const result = toc(helpers.getTestDataContent('sample-1.md'));

        const expectedPath = helpers.getTestDataPath('sample-1.toc.md');
        //fs.writeFileSync(expectedPath,result);
        const expected = fs.readFileSync(expectedPath, 'utf-8');
        expect(result).to.equals(expected);
    });

    it('should produce expected markdown for sample-2.md handling custom title id', function () {
        const result = toc(helpers.getTestDataContent('sample-2.md'));

        const expectedPath = helpers.getTestDataPath('sample-2.toc.md');
        fs.writeFileSync(expectedPath, result);
        const expected = fs.readFileSync(expectedPath, 'utf-8');
        expect(result).to.equals(expected);
    });
});

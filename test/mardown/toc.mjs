import { expect } from 'chai';

import toc from '../../src/markdown/toc.js';

import helpers from '../helpers.js';
import fs from 'fs';

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

import { expect } from 'chai';

import { getTestDataContent, getTestDataPath } from '../helpers';
import fs from 'fs';

import toc from '../../src/markdown/toc.js';

describe('Regress test for markdown.toc', function () {
    it('should produce expected markdown for sample-1.md', function () {
        const result = toc(getTestDataContent('sample-1.md'));

        const expectedPath = getTestDataPath('sample-1.toc.md');
        //fs.writeFileSync(expectedPath,result);
        const expected = fs.readFileSync(expectedPath, 'utf-8');
        expect(result).to.equals(expected);
    });

    it('should produce expected markdown for sample-2.md handling custom title id', function () {
        const result = toc(getTestDataContent('sample-2.md'));

        const expectedPath = getTestDataPath('sample-2.toc.md');
        fs.writeFileSync(expectedPath, result);
        const expected = fs.readFileSync(expectedPath, 'utf-8');
        expect(result).to.equals(expected);
    });
});

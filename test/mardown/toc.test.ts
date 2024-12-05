import { getTestDataContent, getTestDataPath } from '../helpers';
import { readFileSync, writeFileSync } from 'fs';

import toc from '../../src/markdown/toc.js';

const UPDATE_REGRESS_TEST = process.env.UPDATE_REGRESS_TEST == '1' ? true : false;

describe('Regress test for markdown.toc', function () {
    it('should produce expected markdown for sample-1.md', function () {
        const result = toc(getTestDataContent('sample-1.md'));

        const expectedPath = getTestDataPath('sample-1.toc.md');
        if ( UPDATE_REGRESS_TEST ){
            writeFileSync(expectedPath,result);
        }
        const expected = readFileSync(expectedPath, 'utf-8');
        expect(result).toEqual(expected);
    });

    it('should produce expected markdown for sample-2.md handling custom title id', function () {
        const result = toc(getTestDataContent('sample-2.md'));

        const expectedPath = getTestDataPath('sample-2.toc.md');
        if ( UPDATE_REGRESS_TEST ){
            writeFileSync(expectedPath,result);
        }
        const expected = readFileSync(expectedPath, 'utf-8');
        expect(result).toEqual(expected);
    });
});

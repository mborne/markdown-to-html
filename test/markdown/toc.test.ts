import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

import toc from '../../src/markdown/toc.js';
import { getTestDataContent, getTestDataPath } from '../helpers.js';

describe('Regress test for markdown.toc', function () {
    it('should produce expected markdown for sample-1.md', function () {
        const result = toc(getTestDataContent('sample-1.md'));

        const expected = fs.readFileSync(
            getTestDataPath('sample-1.toc.md'),
            'utf-8'
        );
        expect(result).toBe(expected);
    });

    it('should produce expected markdown for sample-2.md handling custom title id', function () {
        const result = toc(getTestDataContent('sample-2.md'));

        const expected = fs.readFileSync(
            getTestDataPath('sample-2.toc.md'),
            'utf-8'
        );
        expect(result).toBe(expected);
    });
});

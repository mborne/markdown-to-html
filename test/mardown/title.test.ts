import { expect } from 'chai';

import { getTestDataContent } from '../helpers';

import title from '../../src/markdown/title.js';

describe('Regress test for markdown.title', function () {
    it('should extract h1 title for sample-1.md', function () {
        const result = title(getTestDataContent('sample-1.md'));
        const expected = 'Main title ignored by toc';
        expect(result).to.equals(expected);
    });

    it('should extract null title for sample-no-h1.md', function () {
        const result = title(getTestDataContent('sample-no-h1.md'));
        const expected = null;
        expect(result).to.equals(expected);
    });
});

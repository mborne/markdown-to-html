import { describe, it, expect } from 'vitest';

import title from '../../src/markdown/title.js';
import { getTestDataContent } from '../helpers.js';

describe('Regress test for markdown.title', function () {
    it('should extract h1 title for sample-1.md', function () {
        expect(title(getTestDataContent('sample-1.md'))).toBe(
            'Main title ignored by toc'
        );
    });

    it('should extract null title for sample-no-h1.md', function () {
        expect(title(getTestDataContent('sample-no-h1.md'))).toBeNull();
    });
});

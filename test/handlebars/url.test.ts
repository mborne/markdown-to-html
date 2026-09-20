import { describe, it, expect } from 'vitest';
import type { HelperOptions } from 'handlebars';

import url from '../../src/handlebars/url.js';
import { getSampleDir } from '../helpers.js';

const sampleRootDir = getSampleDir('01-default-layout');
const samplePath = `${sampleRootDir}/features/custom-heading-id.md`;

const options = {
    data: {
        root: {
            rootDir: sampleRootDir,
            path: samplePath,
        },
    },
} as HelperOptions;

describe('Test handlebar helper url', function () {
    it('should compute path to root for /', function () {
        expect(url('/', options).toString()).toBe('../');
    });
    it('should work for features/mathjax.md', function () {
        expect(url('features/mathjax.md', options).toString()).toBe(
            'mathjax.md'
        );
    });
});

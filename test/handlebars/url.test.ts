import { expect } from 'chai';

import { helpers } from '../helpers';

import { url } from '../../src/handlebars/url.js';

const sampleRootDir = helpers.getSampleDir('01-default-layout');
const samplePath = `${sampleRootDir}/features/custom-heading-id.md`;

const options = {
    data: {
        root: {
            rootDir: sampleRootDir,
            path: samplePath,
        },
    },
};

describe('Test handlebar helper url', function () {
    it('should compute path to root for /', async function () {
        const result = url('/', options);
        expect(result.toString()).to.equal('../');
    });
    it('should work for features/mathjax.md', async function () {
        const result = url('features/mathjax.md', options);
        expect(result.toString()).to.equal('mathjax.md');
    });
});

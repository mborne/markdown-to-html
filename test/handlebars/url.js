const expect = require('chai').expect;

const path = require('path');
const url = require('../../src/handlebars/url');

const sampleRootDir = path.resolve(
    __dirname,
    '../../samples/01-default-layout'
);
const samplePath = path.resolve(
    __dirname,
    '../../samples/01-default-layout/features/custom-heading-id.md'
);
const options = {
    data: {
        root: {
            rootDir: sampleRootDir,
            path: samplePath,
        },
    },
};

describe('Test handlebar helper url', async function () {
    it('should compute path to root for /', async function () {
        const result = url('/', options);
        expect(result.toString()).to.equal('../');
    });
    it('should work for features/mathjax.md', async function () {
        const result = url('features/mathjax.md', options);
        expect(result.toString()).to.equal('mathjax.md');
    });
});

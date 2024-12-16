import { getSampleDir } from '../helpers';

import { url } from '../../src/handlebars/url';

const sampleRootDir = getSampleDir('01-default-layout');
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
        expect(result.toString()).toEqual('../');
    });
    it('should work for features/mathjax.md', async function () {
        const result = url('features/mathjax.md', options);
        expect(result.toString()).toEqual('mathjax.md');
    });
});

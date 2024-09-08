import { expect } from 'chai';

import convert from '../../src/command/convert.js';

import { existsSync } from 'fs';

import helpers from '../helpers.js';

// source
const sourceDirPath = helpers.getSampleDir('01-default-layout');
// layout
const layoutPath = helpers.getLayoutPath('default');

describe('test command/convert', function () {
    it('should convert files to html', function () {
        const outputDirPath = helpers.getTempDirPath();
        convert(sourceDirPath, outputDirPath, layoutPath);

        const expectedFiles = [
            `${outputDirPath}/no-index`,
            `${outputDirPath}/no-index/no-index.html`,
            `${outputDirPath}/index.html`,
            `${outputDirPath}/html-view`,
            `${outputDirPath}/html-view/index.html`,
            `${outputDirPath}/html-view/data.csv`,
            `${outputDirPath}/html-page`,
            `${outputDirPath}/html-page/index.html`,
            `${outputDirPath}/subdir-index`,
            `${outputDirPath}/subdir-index/index.html`,
        ];
        for (const expectedFile of expectedFiles) {
            expect(existsSync(expectedFile), `${expectedFile} file not found!`)
                .to.be.true;
        }
    });
});

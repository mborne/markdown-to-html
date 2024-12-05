import { expect } from 'chai';

import convert from '../../src/command/convert.js';

import { getLayoutPath, getSampleDir, getTempDirPath } from '../helpers';
import { existsSync } from 'fs';

const sourceDirPath = getSampleDir('01-default-layout');
const layoutPath = getLayoutPath('default');

describe('test command/convert', function () {
    it('should convert files to html', function () {
        const outputDirPath = getTempDirPath();
        convert(sourceDirPath, outputDirPath, layoutPath, {
            language: 'fr',
        });

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

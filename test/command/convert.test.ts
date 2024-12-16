import { convert } from '../../src/command/convert';

import { getLayoutPath, getSampleDir, getTempDirPath } from '../helpers';
import { existsSync } from 'fs';

const sourceDirPath = getSampleDir('01-default-layout');
const layoutPath = getLayoutPath('default');

describe('test command/convert', function () {
    describe('ensure that expected files are produced for 01-default-layout', function () {
        const outputDirPath = getTempDirPath();
        convert(sourceDirPath, outputDirPath, layoutPath, {
            language: 'fr',
            force: false,
        });

        const expectedFiles = [
            'no-index',
            'no-index/no-index.html',
            'index.html',
            'html-view',
            'html-view/index.html',
            'html-view/data.csv',
            'html-page',
            'html-page/index.html',
            'subdir-index',
            'subdir-index/index.html',
        ];

        for (const expectedFile of expectedFiles) {
            it(`should produce ${expectedFile}`, function () {
                expect(existsSync(`${outputDirPath}/${expectedFile}`)).toBe(true);
            });
        }
    });
});

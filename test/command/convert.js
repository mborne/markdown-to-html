const expect = require('chai').expect;

const convert = require('../../src/command/convert');

const fs = require('fs');
const path = require('path');

// source
const sourceDirPath = __dirname + '/../../samples/01-default-layout';

// layout
const layoutPath = path.resolve(__dirname, '../../layout/default');

// output
const os = require('os');
const uuid = require('uuid');
const outputDirPath = os.tmpdir() + '/md2html-' + uuid.v4();

describe('test command/convert', function () {
    it('should convert files to html', function () {
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
            expect(
                fs.existsSync(expectedFile),
                `${expectedFile} file not found!`
            ).to.be.true;
        }
    });
});

const expect = require('chai').expect;

const convert = require('../../src/command/convert');

const fs = require('fs');
const path = require('path');
const rootDir = __dirname + '/../data';

const os = require('os');
const uuid = require('uuid');
const outputDir = os.tmpdir() + '/md2html-' + uuid.v4();
const layoutPath = path.resolve(__dirname, '../../layout/default');

const shell = require('shelljs');

describe('test command/convert', function () {
    it('should convert files to html', function () {
        convert({
            rootDir: rootDir,
            outputDir: outputDir,
            layoutPath: layoutPath,
        });

        const expectedFiles = [
            `${outputDir}/no-index`,
            `${outputDir}/no-index/no-index.html`,
            `${outputDir}/README.html`,
            `${outputDir}/html-view`,
            `${outputDir}/html-view/index.html`,
            `${outputDir}/html-view/data.csv`,
            `${outputDir}/subdir`,
            `${outputDir}/subdir/index.html`,
        ];
        for (const expectedFile of expectedFiles) {
            expect(
                fs.existsSync(expectedFile),
                `${expectedFile} file not found!`
            ).to.be.true;
        }
    });
});

const expect = require('chai').expect;

const SourceDir = require('../src/SourceDir');
const sampleSourceDir = new SourceDir(__dirname + '/data');

describe('test SourceDir', function () {
    describe('test findFile', function () {
        it('should find files in sample directory', function () {
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).to.be.an('array');
            expect(sourceFiles.length).to.equal(9);

            let directories = sourceFiles.filter(function (sourceFile) {
                return sourceFile.type == 'directory';
            });
            // note that rootDir is included
            expect(directories.length).to.equal(4);
        });
    });

    describe('test locateFile', function () {
        it('should find empty path as README.md', function () {
            let absolutePath = sampleSourceDir.locateFile('');
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('/README.md')).to.be.true;
        });

        it('should find subdir as subdir/index.md', function () {
            let absolutePath = sampleSourceDir.locateFile('subdir');
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('subdir/index.md')).to.be.true;
        });

        it('should should resolve html-view/data.csv file', function () {
            let absolutePath = sampleSourceDir.locateFile('html-view/data.csv');
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('html-view/data.csv')).to.be.true;
        });

        it('should should resolve no-index/no-index.md file', function () {
            let absolutePath = sampleSourceDir.locateFile(
                'no-index/no-index.md'
            );
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('no-index/no-index.md')).to.be.true;
        });

        it('should should return null if directory does not contains a readme/index file', function () {
            let absolutePath = sampleSourceDir.locateFile('no-index');
            expect(absolutePath).to.be.null;
        });

        it('should should return null if file is not found', function () {
            let absolutePath = sampleSourceDir.locateFile('does-not-exist.md');
            expect(absolutePath).to.be.null;
        });

        it('should protect against path traversal with absolute path', function () {
            let absolutePath = sampleSourceDir.locateFile('/etc/hosts');
            expect(absolutePath).to.be.null;
        });

        it('should protect against path traversal with relative path', function () {
            let absolutePath = sampleSourceDir.locateFile('../README.md');
            expect(absolutePath).to.be.null;
        });
    });

    describe('test isIgnored', function () {
        it('should ignore .git directories', function () {
            expect(
                sampleSourceDir.isIgnored('something/.git/something-else.md')
            ).to.be.true;
        });
    });
});

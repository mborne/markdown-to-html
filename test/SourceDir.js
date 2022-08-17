const expect = require('chai').expect;

const SourceDir = require('../src/SourceDir');
const sampleSourceDir = new SourceDir(__dirname + '/data');

describe('test SourceDir', function () {
    describe('test findFile', function () {
        it('should find files in sample directory', function () {
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).to.be.an('array');
            expect(sourceFiles.length).to.equal(14);

            let directories = sourceFiles.filter(function (sourceFile) {
                return sourceFile.type == 'directory';
            });
            // note that rootDir is included
            expect(directories.length).to.equal(5);
        });
    });

    describe('test locateFile', function () {
        it('should find empty path as rootDir', function () {
            let sourceFile = sampleSourceDir.locateFile('');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals('directory');
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath).to.equals(sampleSourceDir.rootDir);
        });

        it('should find subdir as a directory', function () {
            let sourceFile = sampleSourceDir.locateFile('subdir');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals('directory');
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('subdir')).to.be.true;
        });

        it('should should resolve html-view/data.csv file', function () {
            let sourceFile = sampleSourceDir.locateFile('html-view/data.csv');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals('static');
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('html-view/data.csv')).to.be.true;
        });

        it('should should resolve no-index/no-index.md file', function () {
            let sourceFile = sampleSourceDir.locateFile('no-index/no-index.md');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals('md');
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('no-index/no-index.md')).to.be.true;
        });

        it('should should resolve directory without readme or index file', function () {
            let sourceFile = sampleSourceDir.locateFile('no-index');
            // check type
            expect(sourceFile.type).to.equals('directory');
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.be.not.null;
            expect(absolutePath.endsWith('/no-index'));
        });

        it('should should return null if file is not found', function () {
            let sourceFile = sampleSourceDir.locateFile('does-not-exist.md');
            expect(sourceFile).to.be.null;
        });

        it('should protect against path traversal with absolute path', function () {
            let sourceFile = sampleSourceDir.locateFile('/etc/hosts');
            expect(sourceFile).to.be.null;
        });

        it('should protect against path traversal with relative path', function () {
            let sourceFile = sampleSourceDir.locateFile('../README.md');
            expect(sourceFile).to.be.null;
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

const expect = require('chai').expect;

const FileType = require('../src/FileType');
const SourceDir = require('../src/SourceDir');
const sampleSourceDir = new SourceDir(
    __dirname + '/../samples/01-default-layout'
);

describe('test SourceDir using samples/01-default-layout', function () {
    describe('test findFile', function () {
        it('should find files in sample directory', function () {
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).to.be.an('array');
            expect(sourceFiles.length).to.greaterThan(15);

            let directories = sourceFiles.filter(function (sourceFile) {
                return sourceFile.type == FileType.DIRECTORY;
            });
            // note that rootDir is included
            expect(directories.length).to.equal(6);
        });
    });

    describe('test locateFile', function () {
        it('should find empty path as rootDir', function () {
            let sourceFile = sampleSourceDir.locateFile('');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals(FileType.DIRECTORY);
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath).to.equals(sampleSourceDir.rootDir);
        });

        it('should find subdir-index as a directory', function () {
            let sourceFile = sampleSourceDir.locateFile('subdir-index');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals(FileType.DIRECTORY);
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('subdir-index')).to.be.true;
        });

        it('should should resolve html-view/data.csv as a static file', function () {
            let sourceFile = sampleSourceDir.locateFile('html-view/data.csv');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals(FileType.STATIC);
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('html-view/data.csv')).to.be.true;
        });

        it('should should resolve no-index/no-index.md file', function () {
            let sourceFile = sampleSourceDir.locateFile('no-index/no-index.md');
            expect(sourceFile).to.not.be.null;
            // check type
            expect(sourceFile.type).to.equals(FileType.MARKDOWN);
            // check absolutePath
            let absolutePath = sourceFile.absolutePath;
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('no-index/no-index.md')).to.be.true;
        });

        it('should should resolve directory without readme or index file', function () {
            let sourceFile = sampleSourceDir.locateFile('no-index');
            // check type
            expect(sourceFile.type).to.equals(FileType.DIRECTORY);
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

    describe('test locateIndex', function () {
        it('should find subdir-index/index.md in subdir-index', function () {
            let dirFile = sampleSourceDir.locateFile('subdir-index');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.not.null;
            expect(sourceFile.type).to.equals(FileType.MARKDOWN);
            expect(sourceFile.absolutePath).to.be.not.null;
            expect(sourceFile.absolutePath.endsWith('subdir-index/index.md'));
        });

        it('should find subdir-readme/README.md in subdir-readme', function () {
            let dirFile = sampleSourceDir.locateFile('subdir-readme');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.not.null;
            expect(sourceFile.type).to.equals(FileType.MARKDOWN);
            expect(sourceFile.absolutePath).to.be.not.null;
            expect(sourceFile.absolutePath.endsWith('subdir-index/README.md'));
        });

        it('should return null for subdir-readme', function () {
            let dirFile = sampleSourceDir.locateFile('no-index');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
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

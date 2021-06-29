const expect = require('chai').expect;

const SourceDir = require('../src/SourceDir');
const sampleSourceDir = new SourceDir(__dirname+'/../sample');

describe('test SourceDir', function () {
    describe('test findFile', function () {
        it('should find files in sample directory', function () {
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).to.be.an('array');
            expect(sourceFiles.length).to.equal(8);

            let directories = sourceFiles.filter(function(sourceFile){
                return sourceFile.type == 'directory'
            });
            expect(directories.length).to.equal(3);
        });
    });

    describe('test locateFile', function () {
        it('should find empty path as index.md', function () {
            let absolutePath = sampleSourceDir.locateFile('');
            expect(absolutePath).to.not.be.null;
            expect(absolutePath.endsWith('/index.md')).to.be.true;
        });
    });
});


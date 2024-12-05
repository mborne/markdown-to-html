import { expect } from 'chai';

import { getSampleDir, getTestDataPath, PROJECT_DIR } from './helpers';

import { FileType } from '../src/FileType.js';
import { SourceDir } from '../src/SourceDir.js';

describe('Test SourceDir', function () {

    describe('test constructor with invalid rootDir', function () {

        it('should throw if rootDir is not found', function () {
            const rootDir = getSampleDir('not-found');
            expect(function () {
                new SourceDir(rootDir);
            }).to.throw(Error, `Input file ${rootDir} not found`);
        });
    
        it('should throw if rootDir is not a directory', function () {
            const rootDir = getTestDataPath('sample-1.md');
            expect(function () {
                new SourceDir(rootDir);
            }).to.throw(Error, `Input file ${rootDir} is not a directory`);
        });

    });


    describe('test findFile', function () {
        it('should find files in sample directory', function () {
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).to.be.an('array');
            expect(sourceFiles.length).to.greaterThan(15);

            let directories = sourceFiles.filter(function (sourceFile) {
                return sourceFile.type == FileType.DIRECTORY;
            });
            // note that rootDir is included
            expect(directories.length).to.equal(7);
        });
    });

    describe('test locateFile', function () {
        describe('test locateFile with a directory', function () {
            it('should find empty path as rootDir', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
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
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile('subdir-index');
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.DIRECTORY);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('subdir-index')).to.be.true;
            });

            it('should should resolve directory without readme or index file', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile('no-index');
                // check type
                expect(sourceFile.type).to.equals(FileType.DIRECTORY);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.be.not.null;
                expect(absolutePath.endsWith('/no-index'));
            });
        });

        describe('test locateFile with a .md file', function () {
            it('should should resolve no-index/no-index.md file', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile(
                    'no-index/no-index.md'
                );
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.MARKDOWN);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('no-index.md')).to.be.true;
            });

            it('should resolve no-index/no-index.html as no-index/no-index.md', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile(
                    'no-index/no-index.html'
                );
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.MARKDOWN);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('no-index.md')).to.be.true;
            });
        });

        describe('test locateFile with a .phtml file', function () {
            it('should should resolve html-view/index.phtml as an HTML view', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile(
                    'html-view/index.phtml'
                );
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.PHTML);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('index.phtml')).to.be.true;
            });

            it('should resolve html-view/index.html as html-view/index.phtml', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile(
                    'html-view/index.html'
                );
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.PHTML);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('index.phtml')).to.be.true;
            });
        });

        describe('test locateFile with a static .csv file', function () {
            it('should should resolve html-view/data.csv as a static file', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile =
                    sampleSourceDir.locateFile('html-view/data.csv');
                expect(sourceFile).to.not.be.null;
                // check type
                expect(sourceFile.type).to.equals(FileType.STATIC);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).to.not.be.null;
                expect(absolutePath.endsWith('data.csv')).to.be.true;
            });
        });

        describe('test locateFile not found', function () {
            it('should return null for does-not-exist.md', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile =
                    sampleSourceDir.locateFile('does-not-exist.md');
                expect(sourceFile).to.be.null;
            });

            it('should return null for does-not-exist.html', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                // note that it will try .md and .phtml
                let sourceFile = sampleSourceDir.locateFile(
                    'does-not-exist.html'
                );
                expect(sourceFile).to.be.null;
            });
        });

        describe('test path traversal protection', function () {
            it('should protect against path traversal with absolute path', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile('/etc/hosts');
                expect(sourceFile).to.be.null;
            });

            it('should protect against path traversal with relative path', function () {
                const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
                let sourceFile = sampleSourceDir.locateFile('../README.md');
                expect(sourceFile).to.be.null;
            });
        });
    });

    describe('test locateIndex', function () {
        it('should find subdir-index/index.md in subdir-index', function () {
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
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
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
            let dirFile = sampleSourceDir.locateFile('subdir-readme');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.not.null;
            expect(sourceFile.type).to.equals(FileType.MARKDOWN);
            expect(sourceFile.absolutePath).to.be.not.null;
            expect(sourceFile.absolutePath.endsWith('subdir-index/README.md'));
        });

        it('should find html-view/index.phtml in html-view', function () {
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
            let dirFile = sampleSourceDir.locateFile('html-view');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.not.null;
            expect(sourceFile.type).to.equals(FileType.PHTML);
            expect(sourceFile.absolutePath).to.be.not.null;
            expect(sourceFile.absolutePath.endsWith('html-view/index.phtml'));
        });

        it('should find html-page/index.html in html-page', function () {
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
            let dirFile = sampleSourceDir.locateFile('html-page');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.not.null;
            expect(sourceFile.type).to.equals(FileType.STATIC);
            expect(sourceFile.absolutePath).to.be.not.null;
            expect(sourceFile.absolutePath.endsWith('html-page/index.html'));
        });

        it('should return null for no-index', function () {
            const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
            let dirFile = sampleSourceDir.locateFile('no-index');
            expect(dirFile).to.be.not.null;
            expect(dirFile.type).to.equals(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).to.be.null;
        });
    });

});


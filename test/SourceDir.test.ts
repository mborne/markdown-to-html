import { getSampleDir, getTestDataPath } from './helpers';

import { FileType } from '../src/FileType.js';
import { SourceDir } from '../src/SourceDir.js';

describe('Test SourceDir', function () {
    describe('test constructor with invalid rootDir', function () {
        it('should throw if rootDir is not found', function () {
            const rootDir = getSampleDir('not-found');
            expect(function () {
                new SourceDir(rootDir);
            }).toThrow(`Input file ${rootDir} not found`);
        });

        it('should throw if rootDir is not a directory', function () {
            const rootDir = getTestDataPath('sample-1.md');
            expect(function () {
                new SourceDir(rootDir);
            }).toThrow(`Input file ${rootDir} is not a directory`);
        });
    });

    describe('test findFiles', function () {
        it('should find files in sample directory', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let sourceFiles = sampleSourceDir.findFiles();
            expect(sourceFiles).toBeInstanceOf(Array);
            expect(sourceFiles.length).toBeGreaterThan(15);

            let directories = sourceFiles.filter(function (sourceFile) {
                return sourceFile.type == FileType.DIRECTORY;
            });
            // note that rootDir is not more included
            expect(directories.length).toEqual(6);
        });
    });

    describe('test locateFile', function () {
        describe('test locateFile with a directory', function () {
            it('should find empty path as rootDir', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile('');
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.DIRECTORY);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath).toEqual(sampleSourceDir.rootDir);
            });

            it('should find subdir-index as a directory', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile('subdir-index');
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.DIRECTORY);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('subdir-index')).toBe(true);
            });

            it('should should resolve directory without readme or index file', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile('no-index');
                // check type
                expect(sourceFile.type).toEqual(FileType.DIRECTORY);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('/no-index'));
            });
        });

        describe('test locateFile with a .md file', function () {
            it('should should resolve no-index/no-index.md file', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile(
                    'no-index/no-index.md'
                );
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.MARKDOWN);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('no-index.md')).toBe(true);
            });

            it('should resolve no-index/no-index.html as no-index/no-index.md', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile(
                    'no-index/no-index.html'
                );
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.MARKDOWN);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('no-index.md')).toBe(true);
            });
        });

        describe('test locateFile with a .phtml file', function () {
            it('should should resolve html-view/index.phtml as an HTML view', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile(
                    'html-view/index.phtml'
                );
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.PHTML);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('index.phtml')).toBe(true);
            });

            it('should resolve html-view/index.html as html-view/index.phtml', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile(
                    'html-view/index.html'
                );
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.PHTML);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('index.phtml')).toBe(true);
            });
        });

        describe('test locateFile with a static .csv file', function () {
            it('should should resolve html-view/data.csv as a static file', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile =
                    sampleSourceDir.locateFile('html-view/data.csv');
                expect(sourceFile).not.toBeNull();
                // check type
                expect(sourceFile.type).toEqual(FileType.STATIC);
                // check absolutePath
                let absolutePath = sourceFile.absolutePath;
                expect(absolutePath).not.toBeNull();
                expect(absolutePath.endsWith('data.csv')).toBe(true);
            });
        });

        describe('test locateFile not found', function () {
            it('should return null for does-not-exist.md', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile =
                    sampleSourceDir.locateFile('does-not-exist.md');
                expect(sourceFile).toBeNull();
            });

            it('should return null for does-not-exist.html', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                // note that it will try .md and .phtml
                let sourceFile = sampleSourceDir.locateFile(
                    'does-not-exist.html'
                );
                expect(sourceFile).toBeNull();
            });
        });

        describe('test path traversal protection', function () {
            it('should protect against path traversal with absolute path', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile('/etc/hosts');
                expect(sourceFile).toBeNull();
            });

            it('should protect against path traversal with relative path', function () {
                const sampleSourceDir = new SourceDir(
                    getSampleDir('01-default-layout')
                );
                let sourceFile = sampleSourceDir.locateFile('../README.md');
                expect(sourceFile).toBeNull();
            });
        });
    });

    describe('test locateIndex', function () {
        it('should find subdir-index/index.md in subdir-index', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let dirFile = sampleSourceDir.locateFile('subdir-index');
            expect(dirFile).not.toBeNull();
            expect(dirFile.type).toEqual(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).not.toBeNull();
            expect(sourceFile.type).toEqual(FileType.MARKDOWN);
            expect(sourceFile.absolutePath).not.toBeNull();
            expect(sourceFile.absolutePath.endsWith('subdir-index/index.md'));
        });

        it('should find subdir-readme/README.md in subdir-readme', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let dirFile = sampleSourceDir.locateFile('subdir-readme');
            expect(dirFile).not.toBeNull();
            expect(dirFile.type).toEqual(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).not.toBeNull();
            expect(sourceFile.type).toEqual(FileType.MARKDOWN);
            expect(sourceFile.absolutePath).not.toBeNull();
            expect(sourceFile.absolutePath.endsWith('subdir-index/README.md'));
        });

        it('should find html-view/index.phtml in html-view', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let dirFile = sampleSourceDir.locateFile('html-view');
            expect(dirFile).not.toBeNull();
            expect(dirFile.type).toEqual(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).not.toBeNull();
            expect(sourceFile.type).toEqual(FileType.PHTML);
            expect(sourceFile.absolutePath).not.toBeNull();
            expect(sourceFile.absolutePath.endsWith('html-view/index.phtml'));
        });

        it('should find html-page/index.html in html-page', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let dirFile = sampleSourceDir.locateFile('html-page');
            expect(dirFile).not.toBeNull();
            expect(dirFile.type).toEqual(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).not.toBeNull();
            expect(sourceFile.type).toEqual(FileType.STATIC);
            expect(sourceFile.absolutePath).not.toBeNull();
            expect(sourceFile.absolutePath.endsWith('html-page/index.html'));
        });

        it('should return null for no-index', function () {
            const sampleSourceDir = new SourceDir(
                getSampleDir('01-default-layout')
            );
            let dirFile = sampleSourceDir.locateFile('no-index');
            expect(dirFile).not.toBeNull();
            expect(dirFile.type).toEqual(FileType.DIRECTORY);

            let sourceFile = sampleSourceDir.locateIndex(dirFile);
            expect(sourceFile).toBeNull();
        });
    });
});

import { describe, it, expect } from 'vitest';

import FileType from '../src/FileType.js';
import SourceDir from '../src/SourceDir.js';
import type SourceFile from '../src/SourceFile.js';
import { PROJECT_DIR, getSampleDir } from './helpers.js';

/**
 * Assert that a lookup succeeded and narrow the result to a SourceFile.
 */
function expectFound(sourceFile: SourceFile | null): SourceFile {
    expect(sourceFile).not.toBeNull();
    return sourceFile as SourceFile;
}

describe('test SourceDir with bad constructor params', function () {
    it('should throw if rootDir is not found', function () {
        const rootDir = PROJECT_DIR + '/not-found/';
        expect(() => new SourceDir(rootDir)).toThrow(
            `Input file ${rootDir} not found`
        );
    });

    it('should throw if rootDir is not a directory', function () {
        const rootDir = PROJECT_DIR + '/README.md';
        expect(() => new SourceDir(rootDir)).toThrow(
            `Input file ${rootDir} is not a directory`
        );
    });
});

const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));

describe('test SourceDir using samples/01-default-layout', function () {
    describe('test findFiles', function () {
        it('should find files in sample directory', function () {
            const sourceFiles = sampleSourceDir.findFiles();
            expect(Array.isArray(sourceFiles)).toBe(true);
            expect(sourceFiles.length).toBeGreaterThan(15);

            const directories = sourceFiles.filter(
                (sourceFile) => sourceFile.type === FileType.DIRECTORY
            );
            // note that rootDir is included
            expect(directories.length).toBe(7);
        });
    });

    describe('test locateFile', function () {
        describe('test directory', function () {
            it('should find empty path as rootDir', function () {
                const sourceFile = expectFound(sampleSourceDir.locateFile(''));
                expect(sourceFile.type).toBe(FileType.DIRECTORY);
                expect(sourceFile.absolutePath).toBe(sampleSourceDir.rootDir);
            });

            it('should find subdir-index as a directory', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('subdir-index')
                );
                expect(sourceFile.type).toBe(FileType.DIRECTORY);
                expect(sourceFile.absolutePath.endsWith('subdir-index')).toBe(
                    true
                );
            });

            it('should resolve directory without readme or index file', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('no-index')
                );
                expect(sourceFile.type).toBe(FileType.DIRECTORY);
                expect(sourceFile.absolutePath.endsWith('/no-index')).toBe(
                    true
                );
            });
        });

        describe('test markdown', function () {
            it('should resolve no-index/no-index.md file', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('no-index/no-index.md')
                );
                expect(sourceFile.type).toBe(FileType.MARKDOWN);
                expect(
                    sourceFile.absolutePath.endsWith('no-index/no-index.md')
                ).toBe(true);
            });

            it('should resolve no-index/no-index.html as no-index/no-index.md', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('no-index/no-index.html')
                );
                expect(sourceFile.type).toBe(FileType.MARKDOWN);
                expect(
                    sourceFile.absolutePath.endsWith('no-index/no-index.md')
                ).toBe(true);
            });
        });

        describe('test HTML views', function () {
            it('should resolve html-view/index.phtml as an HTML view', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('html-view/index.phtml')
                );
                expect(sourceFile.type).toBe(FileType.PHTML);
                expect(
                    sourceFile.absolutePath.endsWith('html-view/index.phtml')
                ).toBe(true);
            });

            it('should resolve html-view/index.html as html-view/index.phtml', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('html-view/index.html')
                );
                expect(sourceFile.type).toBe(FileType.PHTML);
                expect(
                    sourceFile.absolutePath.endsWith('html-view/index.phtml')
                ).toBe(true);
            });
        });

        describe('test static files', function () {
            it('should resolve html-view/data.csv as a static file', function () {
                const sourceFile = expectFound(
                    sampleSourceDir.locateFile('html-view/data.csv')
                );
                expect(sourceFile.type).toBe(FileType.STATIC);
                expect(
                    sourceFile.absolutePath.endsWith('html-view/data.csv')
                ).toBe(true);
            });
        });

        describe('test not found', function () {
            it('should return null for does-not-exist.md', function () {
                expect(
                    sampleSourceDir.locateFile('does-not-exist.md')
                ).toBeNull();
            });

            it('should return null for does-not-exist.html', function () {
                // note that it will try .md and .phtml
                expect(
                    sampleSourceDir.locateFile('does-not-exist.html')
                ).toBeNull();
            });
        });

        describe('test path traversal protection', function () {
            it('should protect against path traversal with absolute path', function () {
                expect(sampleSourceDir.locateFile('/etc/hosts')).toBeNull();
            });

            it('should protect against path traversal with relative path', function () {
                expect(sampleSourceDir.locateFile('../README.md')).toBeNull();
            });
        });
    });

    describe('test locateIndex', function () {
        it('should find subdir-index/index.md in subdir-index', function () {
            const dirFile = expectFound(
                sampleSourceDir.locateFile('subdir-index')
            );
            expect(dirFile.type).toBe(FileType.DIRECTORY);

            const sourceFile = expectFound(
                sampleSourceDir.locateIndex(dirFile)
            );
            expect(sourceFile.type).toBe(FileType.MARKDOWN);
            expect(
                sourceFile.absolutePath.endsWith('subdir-index/index.md')
            ).toBe(true);
        });

        it('should find subdir-readme/README.md in subdir-readme', function () {
            const dirFile = expectFound(
                sampleSourceDir.locateFile('subdir-readme')
            );
            expect(dirFile.type).toBe(FileType.DIRECTORY);

            const sourceFile = expectFound(
                sampleSourceDir.locateIndex(dirFile)
            );
            expect(sourceFile.type).toBe(FileType.MARKDOWN);
            expect(
                sourceFile.absolutePath.endsWith('subdir-readme/README.md')
            ).toBe(true);
        });

        it('should find html-view/index.phtml in html-view', function () {
            const dirFile = expectFound(
                sampleSourceDir.locateFile('html-view')
            );
            expect(dirFile.type).toBe(FileType.DIRECTORY);

            const sourceFile = expectFound(
                sampleSourceDir.locateIndex(dirFile)
            );
            expect(sourceFile.type).toBe(FileType.PHTML);
            expect(
                sourceFile.absolutePath.endsWith('html-view/index.phtml')
            ).toBe(true);
        });

        it('should find html-page/index.html in html-page', function () {
            const dirFile = expectFound(
                sampleSourceDir.locateFile('html-page')
            );
            expect(dirFile.type).toBe(FileType.DIRECTORY);

            const sourceFile = expectFound(
                sampleSourceDir.locateIndex(dirFile)
            );
            expect(sourceFile.type).toBe(FileType.STATIC);
            expect(
                sourceFile.absolutePath.endsWith('html-page/index.html')
            ).toBe(true);
        });

        it('should return null for no-index', function () {
            const dirFile = expectFound(sampleSourceDir.locateFile('no-index'));
            expect(dirFile.type).toBe(FileType.DIRECTORY);

            expect(sampleSourceDir.locateIndex(dirFile)).toBeNull();
        });
    });
});

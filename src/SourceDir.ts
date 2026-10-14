import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import shell from 'shelljs';

import SourceFile from './SourceFile.js';
import SourceDirFilter from './SourceDirFilter.js';

/**
 * Represents a root directory containing markdown
 * and static files.
 */
export default class SourceDir {
    /** the rendered directory */
    readonly rootDir: string;
    /** the rendered directory with symbolic links resolved */
    private readonly realRootDir: string;
    readonly filter = new SourceDirFilter();

    constructor(rootDir: string) {
        if (!fs.existsSync(rootDir)) {
            throw new Error('Input file ' + rootDir + ' not found');
        }
        if (!fs.lstatSync(rootDir).isDirectory()) {
            throw new Error('Input file ' + rootDir + ' is not a directory');
        }
        this.rootDir = path.resolve(rootDir);
        this.realRootDir = fs.realpathSync(this.rootDir);
    }

    /**
     * Get relative path for a given file.
     */
    getRelativePath(absolutePath: string): string {
        return path.relative(this.rootDir, absolutePath);
    }

    /**
     * Find files in root directory
     */
    findFiles(): SourceFile[] {
        const sourceFiles: SourceFile[] = [];

        shell.find(this.rootDir).forEach((absolutePath) => {
            const relativePath = this.getRelativePath(absolutePath);
            if (this.filter.isIgnored(relativePath)) {
                return;
            }
            sourceFiles.push(new SourceFile(this, absolutePath));
        });

        return sourceFiles;
    }

    /**
     * Locate file in rootDir according to relativePath
     */
    locateFile(relativePath: string): SourceFile | null {
        const absolutePath = path.resolve(this.rootDir, relativePath);

        /*
         * File must be in rootDir (path traversal).
         *
         * Note that the check is performed before any access to the file
         * system, and that comparing the resolved paths as strings is not
         * enough : '<rootDir>-something' starts with '<rootDir>' while being
         * outside of it.
         */
        if (!this.contains(this.rootDir, absolutePath)) {
            return null;
        }

        /*
         * Ignored files (.git, node_modules,...) are not exposed.
         */
        if (this.filter.isIgnored(this.getRelativePath(absolutePath))) {
            return null;
        }

        if (!fs.existsSync(absolutePath)) {
            if (relativePath.endsWith('.html')) {
                return this.locateRenderedFile(relativePath);
            } else {
                return null;
            }
        }

        /*
         * File must remain in rootDir once symbolic links are resolved
         * (a symbolic link to /etc/passwd would otherwise be served).
         */
        if (!this.contains(this.realRootDir, fs.realpathSync(absolutePath))) {
            return null;
        }

        return new SourceFile(this, absolutePath);
    }

    /**
     * Test if an absolute path is parentDir or is located in parentDir.
     */
    private contains(parentDir: string, absolutePath: string): boolean {
        const relativePath = path.relative(parentDir, absolutePath);
        return (
            relativePath === '' ||
            (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
        );
    }

    /**
     * Locate file rendered to html in order to find .md or .phtml files
     * using .html in URLs.
     */
    private locateRenderedFile(relativePath: string): SourceFile | null {
        assert(
            relativePath.endsWith('.html'),
            `${relativePath} is not a .html path!`
        );
        for (const ext of ['.md', '.phtml']) {
            const candidatePath = relativePath.slice(0, -5) + ext;
            const sourceFile = this.locateFile(candidatePath);
            if (sourceFile != null) {
                return sourceFile;
            }
        }
        return null;
    }

    /**
     * Locate index file for a given directory.
     */
    locateIndex(sourceFile: SourceFile): SourceFile | null {
        const candidates = [
            'index.md',
            'index.phtml',
            'index.html',
            'README.md',
            'readme.md',
        ];

        for (const candidate of candidates) {
            const indexFile = this.locateFile(
                path.join(sourceFile.relativePath, candidate)
            );
            if (indexFile !== null) {
                return indexFile;
            }
        }
        return null;
    }
}

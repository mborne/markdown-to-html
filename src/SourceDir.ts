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
    readonly filter = new SourceDirFilter();

    constructor(rootDir: string) {
        if (!fs.existsSync(rootDir)) {
            throw new Error('Input file ' + rootDir + ' not found');
        }
        if (!fs.lstatSync(rootDir).isDirectory()) {
            throw new Error('Input file ' + rootDir + ' is not a directory');
        }
        this.rootDir = path.resolve(rootDir);
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
        if (!this.contains(absolutePath)) {
            return null;
        }

        if (!fs.existsSync(absolutePath)) {
            if (relativePath.endsWith('.html')) {
                return this.locateRenderedFile(relativePath);
            } else {
                return null;
            }
        }

        return new SourceFile(this, absolutePath);
    }

    /**
     * Test if an absolute path is rootDir or is located in rootDir.
     */
    private contains(absolutePath: string): boolean {
        const relativePath = path.relative(this.rootDir, absolutePath);
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
            const candidatePath = `${sourceFile.absolutePath}/${candidate}`;
            if (!fs.existsSync(candidatePath)) {
                continue;
            }
            return new SourceFile(this, candidatePath);
        }
        return null;
    }
}

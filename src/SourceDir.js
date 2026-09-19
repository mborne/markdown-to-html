const { assert } = require('console');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const SourceFile = require('./SourceFile');
const SourceDirFilter = require('./SourceDirFilter');

/**
 * Represents a root directory containing markdown
 * and static files.
 */
class SourceDir {
    /**
     * @param {string} rootDir the rendered directory.
     */
    constructor(rootDir) {
        if (!fs.existsSync(rootDir)) {
            throw new Error('Input file ' + rootDir + ' not found');
        }
        if (!fs.lstatSync(rootDir).isDirectory()) {
            throw new Error('Input file ' + rootDir + ' is not a directory');
        }
        this.rootDir = path.resolve(rootDir);
        this.filter = new SourceDirFilter();
    }

    /**
     * Get relative path for a given file.
     *
     * @param {string} absolutePath
     * @returns {string}
     */
    getRelativePath(absolutePath) {
        return path.relative(this.rootDir, absolutePath);
    }

    /**
     * Find files in root directory
     *
     * @returns {SourceFile[]}
     */
    findFiles() {
        const sourceFiles = [];

        shell.find(this.rootDir).forEach(
            function (absolutePath) {
                const relativePath = this.getRelativePath(absolutePath);
                if (this.filter.isIgnored(relativePath)) {
                    return;
                }
                sourceFiles.push(new SourceFile(this, absolutePath));
            }.bind(this)
        );

        return sourceFiles;
    }

    /**
     * Locate file in rootDir according to relativePath
     *
     * @param {string} relativePath
     * @return {SourceFile?}
     */
    locateFile(relativePath) {
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
     *
     * @private
     *
     * @param {string} absolutePath
     * @returns {boolean}
     */
    contains(absolutePath) {
        const relativePath = path.relative(this.rootDir, absolutePath);
        return (
            relativePath === '' ||
            (!relativePath.startsWith('..') && !path.isAbsolute(relativePath))
        );
    }

    /**
     * Locate file rendered to html in order to find .md or .phtml files
     * using .html in URLs.
     *
     * @private
     *
     * @param {string} relativePath
     * @return {SourceFile?}
     */
    locateRenderedFile(relativePath) {
        assert(
            relativePath.endsWith('.html'),
            `${relativePath} is not a .html path!`
        );
        for (const ext of ['.md', '.phtml']) {
            let candidatePath = relativePath.slice(0, -5) + ext;
            let sourceFile = this.locateFile(candidatePath);
            if (sourceFile != null) {
                return sourceFile;
            }
        }
        return null;
    }

    /**
     * Locate index files
     * @param {SourceFile} sourceFile a directory
     * @return {SourceFile}
     */
    locateIndex(sourceFile) {
        let candidates = [
            'index.md',
            'index.phtml',
            'index.html',
            'README.md',
            'readme.md',
        ];

        for (let candidate of candidates) {
            const candidatePath = `${sourceFile.absolutePath}/${candidate}`;
            if (!fs.existsSync(candidatePath)) {
                continue;
            }
            return new SourceFile(this, candidatePath);
        }
        return null;
    }
}

module.exports = SourceDir;

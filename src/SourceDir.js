const { assert } = require('console');
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const SourceFile = require('./SourceFile');

/**
 * Represents a source directory containing markdown
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
    }

    /**
     * Find files in root directory
     *
     * @returns {SourceFile[]}
     */
    findFiles() {
        var sourceFiles = [];

        shell.find(this.rootDir).forEach(
            function (absolutePath) {
                var relativePath = path.relative(this.rootDir, absolutePath);
                if (this.isIgnored(relativePath)) {
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
        var absolutePath = path.resolve(this.rootDir, relativePath);
        if (!fs.existsSync(absolutePath)) {
            if (relativePath.endsWith('.html')) {
                return this.locateRenderedFile(relativePath);
            } else {
                return null;
            }
        }

        /* file must be in rootDir (path traversal) */
        if (!absolutePath.startsWith(this.rootDir)) {
            return null;
        }

        return new SourceFile(this, absolutePath);
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

    /**
     * Test if a file is ignored (allows to ignore .git directory)
     *
     * @param {string} relativePath
     *
     * @returns {boolean}
     */
    isIgnored(relativePath) {
        /* skip git */
        if (relativePath.match(/\.git/)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = SourceDir;

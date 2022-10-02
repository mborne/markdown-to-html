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
     * @return {SourceFile}
     */
    locateFile(relativePath) {
        var absolutePath = path.resolve(this.rootDir, relativePath);

        /* file must be in rootDir (path traversal) */
        if (!absolutePath.startsWith(this.rootDir)) {
            return null;
        }

        /* file must exists */
        if (!fs.existsSync(absolutePath)) {
            return null;
        }

        return new SourceFile(this, absolutePath);
    }

    /**
     * Locate index.md or readme.md in relativePath
     * @param {SourceFile} sourceFile a directory
     * @return {SourceFile}
     */
    locateIndex(sourceFile) {
        let candidates = ['index.md', 'README.md', 'readme.md'];
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

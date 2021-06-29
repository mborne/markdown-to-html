const fs = require('fs');
const path = require('path');
const shell = require('shelljs');
const renameMdToHtml = require('./helpers/renameMdToHtml');

/**
 * @typedef SourceFile
 * @type {object}
 * @property {string} type - type of the file
 * @property {string} path - absolute path to the file
 * @property {number} relativePath - path relative  to the root dir
 * @property {string} outputRelativePath - output path relative to the root dir
 */

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
            function (inputFile) {
                var relativePath = path.relative(this.rootDir, inputFile);
                if (this.isIgnored(relativePath)) {
                    return;
                }

                if (fs.lstatSync(inputFile).isDirectory()) {
                    sourceFiles.push({
                        type: 'directory',
                        path: inputFile,
                        relativePath: relativePath,
                        outputRelativePath: relativePath,
                    });
                } else if (relativePath.match(/\.md$/)) {
                    var outputRelativePath = renameMdToHtml(relativePath);
                    sourceFiles.push({
                        type: 'md',
                        path: inputFile,
                        relativePath: relativePath,
                        outputRelativePath: outputRelativePath,
                    });
                } else if (relativePath.match(/\.html$/)) {
                    sourceFiles.push({
                        type: 'html',
                        path: inputFile,
                        relativePath: relativePath,
                        outputRelativePath: relativePath,
                    });
                } else {
                    sourceFiles.push({
                        type: 'static',
                        path: inputFile,
                        relativePath: relativePath,
                        outputRelativePath: relativePath,
                    });
                }
            }.bind(this)
        );

        return sourceFiles;
    }

    /**
     * Locate file in rootDir according to relativePath
     *
     * TODO return SourceFile
     *
     * @param {string} relativePath
     * @return {string}
     */
    locateFile(relativePath) {
        var filePath = path.resolve(this.rootDir, relativePath);

        /* file must be in rootDir */
        if (!filePath.startsWith(this.rootDir)) {
            return null;
        }

        /* file must exists */
        if (!fs.existsSync(filePath)) {
            return null;
        }

        /*
         * Lookup index or README in directory
         */
        if (fs.lstatSync(filePath).isDirectory()) {
            if (fs.existsSync(filePath + '/index.md')) {
                return filePath + '/index.md';
            } else if (fs.existsSync(filePath + '/README.md')) {
                return filePath + '/README.md';
            } else {
                return null;
            }
        }
        return filePath;
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

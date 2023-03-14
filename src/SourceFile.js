const fs = require('fs');
const path = require('path');

const FileType = require('./FileType');
const SourceDir = require('./SourceDir');

/**
 * Represents a file in a {@link SourceDir}.
 *
 * @typedef SourceFile
 * @type {object}
 * @property {FileType} type - type of the file
 * @property {string} path - absolute path to the file
 * @property {string} relativePath - path relative  to the root dir
 */
class SourceFile {
    /**
     * @param {SourceDir} sourceDir
     * @param {string} absolutePath
     */
    constructor(sourceDir, absolutePath) {
        this.sourceDir = sourceDir;
        this.absolutePath = absolutePath;

        /*
         * Detect the type of the file
         */
        this.type = FileType.STATIC;
        if (fs.lstatSync(this.absolutePath).isDirectory()) {
            this.type = FileType.DIRECTORY;
        } else if (this.absolutePath.match(/\.md$/)) {
            this.type = FileType.MARKDOWN;
        } else if (this.absolutePath.match(/\.phtml$/)) {
            this.type = FileType.PHTML;
        }

        this.relativePath = path.relative(
            this.sourceDir.rootDir,
            this.absolutePath
        );
    }

    /**
     * Get content for the given file.
     *
     * @returns {string}
     */
    getContentRaw() {
        return fs.readFileSync(this.absolutePath, 'utf-8');
    }
}

module.exports = SourceFile;

const fs = require('fs');
const path = require('path');

const FileType = require('./FileType');
const SourceDir = require('./SourceDir');

class SourceFile {
    /**
     * @param {SourceDir} sourceDir
     * @param {string} absolutePath
     */
    constructor(sourceDir, absolutePath) {
        this.sourceDir = sourceDir;
        this.absolutePath = absolutePath;
        this.type = FileType.STATIC;
        if (fs.lstatSync(this.absolutePath).isDirectory()) {
            this.type = FileType.DIRECTORY;
        } else if (this.absolutePath.match(/\.md$/)) {
            this.type = FileType.MARKDOWN;
        } else if (this.absolutePath.match(/\.html$/)) {
            this.type = FileType.HTML;
        }

        this.relativePath = path.relative(
            this.sourceDir.rootDir,
            this.absolutePath
        );
    }
}

module.exports = SourceFile;

import { lstatSync, readFileSync } from 'fs';
import path from 'path';

import { SourceDir } from './SourceDir.js';

/**
 * @enum {string} - types of files in a {@link SourceDir}
 */
export const FileType = Object.freeze({
    DIRECTORY: 'directory',
    MARKDOWN: 'md',
    PHTML: 'phtml',
    STATIC: 'static',
});

/**
 * Represents a file in a {@link SourceDir}.
 *
 * @typedef SourceFile
 * @type {object}
 * @property {FileType} type - type of the file
 * @property {string} path - absolute path to the file
 * @property {string} relativePath - path relative  to the root dir
 */
export class SourceFile {
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
        if (lstatSync(this.absolutePath).isDirectory()) {
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
        return readFileSync(this.absolutePath, 'utf-8');
    }
}

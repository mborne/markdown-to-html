import { lstatSync, readFileSync } from 'fs';
import path from 'path';

import { SourceDir } from './SourceDir';

/**
 * Types of files in a {@link SourceDir}
 */
export enum FileType {
    DIRECTORY = 'directory',
    MARKDOWN = 'md',
    PHTML = 'phtml',
    STATIC = 'static',
}

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
     * The type of the file
     */
    readonly type: FileType;
    /**
     * The path of the file relative to the root directory
     */
    readonly relativePath: string;

    /**
     * @param {SourceDir} sourceDir the source directory
     * @param {string} absolutePath the absolute path of the file
     */
    constructor(
        readonly sourceDir: SourceDir,
        readonly absolutePath: string
    ) {
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

        this.relativePath = path.relative(this.sourceDir.rootDir, this.absolutePath);
    }

    /**
     * Get content for the given file.
     */
    getContentRaw(): string {
        return readFileSync(this.absolutePath, 'utf-8');
    }
}

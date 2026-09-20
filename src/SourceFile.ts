import fs from 'node:fs';
import path from 'node:path';

import FileType from './FileType.js';
import type SourceDir from './SourceDir.js';

/**
 * Represents a file in a {@link SourceDir}.
 */
export default class SourceFile {
    /** type of the file */
    readonly type: FileType;
    /** path of the file relative to the root dir */
    readonly relativePath: string;

    constructor(
        readonly sourceDir: SourceDir,
        /** absolute path to the file */
        readonly absolutePath: string
    ) {
        /*
         * Detect the type of the file
         */
        if (fs.lstatSync(this.absolutePath).isDirectory()) {
            this.type = FileType.DIRECTORY;
        } else if (this.absolutePath.endsWith('.md')) {
            this.type = FileType.MARKDOWN;
        } else if (this.absolutePath.endsWith('.phtml')) {
            this.type = FileType.PHTML;
        } else {
            this.type = FileType.STATIC;
        }

        this.relativePath = path.relative(
            this.sourceDir.rootDir,
            this.absolutePath
        );
    }

    /**
     * Get content for the given file.
     */
    getContentRaw(): string {
        return fs.readFileSync(this.absolutePath, 'utf-8');
    }
}

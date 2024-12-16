import assert from 'assert';
import fs, { readdirSync } from 'fs';
import path from 'path';
import { SourceFile } from './SourceFile';
import { SourceDirFilter } from './SourceDirFilter';

/**
 * Represents a root directory containing markdown
 * and static files.
 */
export class SourceDir {
    /**
     * The directory containing sources
     */
    readonly rootDir: string;

    /**
     * Filter files
     */
    private filter: SourceDirFilter;

    constructor(rootDir: string) {
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
     */
    getRelativePath(absolutePath: string): string {
        return path.relative(this.rootDir, absolutePath);
    }

    /**
     * Find files in root directory
     */
    findFiles(): SourceFile[] {
        const sourceFiles = [];

        // list all files and directories recursively
        const relativePaths = readdirSync(this.rootDir, {
            recursive: true,
        }) as string[];

        // filter out directories and files that are ignored
        for (const relativePath of relativePaths) {
            if (this.filter.isIgnored(relativePath)) {
                continue;
            }
            const absolutePath = path.resolve(this.rootDir, relativePath);
            sourceFiles.push(new SourceFile(this, absolutePath));
        }
        return sourceFiles;
    }

    /**
     * Locate file in rootDir according to relativePath
     */
    locateFile(relativePath: string): SourceFile | null {
        const absolutePath = path.resolve(this.rootDir, relativePath);
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
     */
    locateRenderedFile(relativePath: string): SourceFile | null {
        assert(relativePath.endsWith('.html'), `${relativePath} is not a .html path!`);
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
    locateIndex(sourceFile: SourceFile): SourceFile | null {
        let candidates = ['index.md', 'index.phtml', 'index.html', 'README.md', 'readme.md'];

        for (let candidate of candidates) {
            const candidatePath = path.resolve(sourceFile.absolutePath, candidate);
            if (!fs.existsSync(candidatePath)) {
                continue;
            }
            return new SourceFile(this, candidatePath);
        }
        return null;
    }
}

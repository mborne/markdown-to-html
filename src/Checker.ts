import createDebug from 'debug';
import fs from 'node:fs';
import path from 'node:path';

import FileType from './FileType.js';
import * as markdown from './markdown/index.js';
import getMetadata from './html/getMetadata.js';
import checkUrlExists from './helpers/checkUrlExists.js';
import { ErrorCode, ErrorLevel } from './types.js';

import type SourceDir from './SourceDir.js';
import type SourceFile from './SourceFile.js';
import type { CheckError, HtmlLink } from './types.js';

const debug = createDebug('markdown-to-html');

export interface CheckerOptions {
    /** perform request to check external links? */
    checkExternalLinks?: boolean;
}

/**
 * Helper class to check files in a source directory
 */
export default class Checker {
    private readonly checkExternalLinks: boolean;

    constructor(options: CheckerOptions = {}) {
        this.checkExternalLinks = options.checkExternalLinks ?? false;
    }

    /**
     * Check source directory
     */
    async checkSourceDir(sourceDir: SourceDir): Promise<CheckError[]> {
        debug(`checkSourceDir(${sourceDir.rootDir}) ...`);

        let errors: CheckError[] = [];
        const sourceFiles = sourceDir.findFiles();
        debug(
            `checkSourceDir(${sourceDir.rootDir}) : found ${sourceFiles.length} file(s)...`
        );
        for (const sourceFile of sourceFiles) {
            const newErrors = await this.checkSourceFile(sourceFile);
            errors = [...errors, ...newErrors];
        }

        return errors;
    }

    /**
     * Check source file
     */
    async checkSourceFile(sourceFile: SourceFile): Promise<CheckError[]> {
        debug(`checkSourceFile('${sourceFile.relativePath}') ...`);
        const errors: CheckError[] = [];

        if (
            sourceFile.type === FileType.DIRECTORY ||
            sourceFile.type === FileType.STATIC
        ) {
            debug(
                `checkSourceFile('${sourceFile.relativePath}') : SKIPPED (type=${sourceFile.type})`
            );
            return errors;
        }

        // render content to html
        let htmlContent = sourceFile.getContentRaw();
        if (FileType.MARKDOWN === sourceFile.type) {
            htmlContent = markdown.render(htmlContent);
        }

        // get links from html
        const { links } = getMetadata(htmlContent);
        if (links.length === 0) {
            debug(
                `checkSourceFile('${sourceFile.relativePath}') : SKIPPED (no links found)`
            );
            return errors;
        }

        debug(
            `checkSourceFile('${sourceFile.relativePath}') : ${links.length} link(s) found...`
        );
        for (const link of links) {
            const error = await this.checkLink(sourceFile, link);
            if (error != null) {
                errors.push(error);
            }
        }

        return errors;
    }

    /**
     * Check links from sourceFile
     */
    private async checkLink(
        sourceFile: SourceFile,
        link: HtmlLink
    ): Promise<CheckError | null> {
        const targetUrl = link.targetUrl;
        debug(`checkLink('${sourceFile.relativePath}','${targetUrl}') ...`);
        /*
         * handle anchor link
         */
        if (targetUrl.startsWith('#')) {
            debug(
                `checkLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (anchor link)`
            );
            return null;
        }

        /*
         * handle absolute URL
         */
        if (URL.canParse(targetUrl)) {
            return this.checkExternalLink(sourceFile, targetUrl);
        }

        /*
         * handle relative link
         */
        return this.checkInternalLink(sourceFile, targetUrl);
    }

    /**
     * Check targetUrl as an external link performing a GET request.
     */
    private async checkExternalLink(
        sourceFile: SourceFile,
        targetUrl: string
    ): Promise<CheckError | null> {
        debug(
            `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`
        );
        if (!this.checkExternalLinks) {
            debug(
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (check external links disabled)`
            );
            return null;
        }

        const found = await checkUrlExists(targetUrl);
        if (found) {
            debug(
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS (found)`
            );
            return null;
        }

        debug(
            `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE (not found)`
        );
        return {
            level: ErrorLevel.ERROR,
            code: ErrorCode.DEAD_LINK,
            message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE (not found)`,
        };
    }

    /**
     * Check targetUrl as a path relative to sourceFile.
     */
    private checkInternalLink(
        sourceFile: SourceFile,
        targetUrl: string
    ): CheckError | null {
        debug(
            `checkInternalLink('${sourceFile.relativePath}','${targetUrl}') ...`
        );
        const absoluteTargetPath = path.resolve(
            path.dirname(sourceFile.absolutePath),
            targetUrl
        );
        const found = fs.existsSync(absoluteTargetPath);
        const expectedPath =
            sourceFile.sourceDir.getRelativePath(absoluteTargetPath);
        if (found) {
            debug(
                `checkInternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS ('${expectedPath}' found)`
            );
            return null;
        } else {
            debug(
                `checkInternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE ('${expectedPath}' not found)`
            );
            return {
                level: ErrorLevel.ERROR,
                code: ErrorCode.DEAD_LINK,
                message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE ('${expectedPath}' not found)`,
            };
        }
    }
}

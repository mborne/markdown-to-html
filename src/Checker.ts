import { logger } from './logger';

import fs from 'fs';
import url from 'url';
import path from 'path';

import { SourceDir } from './SourceDir';
import render from './markdown/render';
import { FileType, SourceFile } from './SourceFile';
import getMetadata from './html/getMetadata';
import checkUrlExists from './helpers/checkUrlExists';

export enum ErrorLevel {
    INFO = 'INFO',
    WARNING = 'WARNING',
    ERROR = 'ERROR',
}

export enum ErrorCode {
    DEAD_LINK = 'DEAD_LINK',
}

export interface CheckerOptions {
    /**
     * Perform external link checks using HTTP requests? Default is false.
     */
    checkExternalLinks: boolean;
}

interface CheckerError {
    level: ErrorLevel;
    code: ErrorCode;
    message: string;
}

/**
 * Helper class to check files in a source directory
 */
export class Checker {
    readonly checkExternalLinks: boolean;

    /**
     * @param {object} options
     * @param {boolean} options.checkExternalLinks
     */
    constructor(options: CheckerOptions) {
        this.checkExternalLinks = options.checkExternalLinks || false;
    }

    /**
     * Check all files in a source directory
     */
    async checkSourceDir(sourceDir: SourceDir): Promise<CheckerError[]> {
        logger.info(`checkSourceDir('${sourceDir.rootDir}') ...`);

        let errors = [];
        const sourceFiles = sourceDir.findFiles();
        logger.info(`checkSourceDir(${sourceDir.rootDir}) : found ${sourceFiles.length} file(s)...`);
        for (const sourceFile of sourceFiles) {
            const newErrors = await this.checkSourceFile(sourceFile);
            errors = [...errors, ...newErrors];
        }

        return errors;
    }

    /**
     * Check a source file
     */
    async checkSourceFile(sourceFile: SourceFile): Promise<CheckerError[]> {
        logger.info(`checkSourceFile('${sourceFile.relativePath}') ...`);
        const errors = [];

        if ([FileType.DIRECTORY, FileType.STATIC].includes(sourceFile.type)) {
            logger.info(`checkSourceFile('${sourceFile.relativePath}') : SKIPPED (type=${sourceFile.type})`);
            return errors;
        }

        // render content to html
        let htmlContent = sourceFile.getContentRaw();
        if (FileType.MARKDOWN === sourceFile.type) {
            htmlContent = render(htmlContent) as string;
        }

        // get links from html
        const { links } = getMetadata(htmlContent);
        if (links.length == 0) {
            logger.info(`checkSourceFile('${sourceFile.relativePath}') : SKIPPED (no links found)`);
            return errors;
        }

        logger.info(`checkSourceFile('${sourceFile.relativePath}') : ${links.length} link(s) found...`);
        for (const link of links) {
            let error = await this.checkLink(sourceFile, link);
            if (error != null) {
                errors.push(error);
            }
        }

        return errors;
    }

    /**
     * Check links from sourceFile
     *
     * @param {SourceFile} sourceFile
     * @param {object} link
     * @return {Promise<object|null>}
     */
    async checkLink(sourceFile: SourceFile, link) {
        const targetUrl = link.targetUrl;
        logger.info(`checkLink('${sourceFile.relativePath}','${targetUrl}') ...`);
        /*
         * handle anchor link
         */
        if (targetUrl.startsWith('#')) {
            logger.info(`checkLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (anchor link)`);
            return null;
        }

        /*
         * handle absolute URL
         */
        const parsed = url.parse(targetUrl);
        if (parsed.protocol !== null) {
            return this.checkExternalLink(sourceFile, targetUrl);
        }

        /*
         * handle relative link
         */
        return this.checkInternalLink(sourceFile, targetUrl);
    }

    /**
     * Check targetUrl performing a GET request.
     */
    async checkExternalLink(sourceFile: SourceFile, targetUrl: string): Promise<CheckerError | null> {
        logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`);
        if (!this.checkExternalLinks) {
            logger.info(
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SKIPPED (check external links disabled)`
            );
            return null;
        }

        const found = await checkUrlExists(targetUrl);
        if (found) {
            logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS (found)`);
            return null;
        }

        logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE (not found)`);
        return {
            level: ErrorLevel.ERROR,
            code: ErrorCode.DEAD_LINK,
            message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE (not found)`,
        };
    }

    /**
     * Check internal link ensuring the target file exists.
     */
    checkInternalLink(sourceFile: SourceFile, targetUrl: string): CheckerError | null {
        logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`);
        const absoluteTargetPath = path.resolve(path.dirname(sourceFile.absolutePath), targetUrl);
        const found = fs.existsSync(absoluteTargetPath);
        const expectedPath = sourceFile.sourceDir.getRelativePath(absoluteTargetPath);
        if (found) {
            logger.info(
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS ('${expectedPath}' found)`
            );
            return null;
        } else {
            logger.info(
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : FAILURE ('${expectedPath}' not found)`
            );
            return {
                level: ErrorLevel.ERROR,
                code: ErrorCode.DEAD_LINK,
                message: `${sourceFile.relativePath} -> '${targetUrl}' : FAILURE ('${expectedPath}' not found)`,
            };
        }
    }
}

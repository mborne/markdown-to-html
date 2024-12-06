import { logger } from './logger.js';

import fs from 'fs';
import url from 'url';
import path from 'path';

import { SourceDir } from './SourceDir.js';
import render from './markdown/render.js';
import { FileType } from './SourceFile.js';
import getMetadata from './html/getMetadata.js';
import checkUrlExists from './helpers/checkUrlExists.js';

const ErrorLevel = Object.freeze({
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
});

const ErrorCode = Object.freeze({
    DEAD_LINK: 'DEAD_LINK',
});

/**
 * Helper class to check files in a source directory
 */
export class Checker {
    /**
     * @param {object} options
     * @param {boolean} options.checkExternalLinks
     */
    constructor(options) {
        this.checkExternalLinks = options.checkExternalLinks || false;
    }

    /**
     * Check source directory
     * @param {SourceDir} sourceDir
     * @returns {Promise<array>}
     */
    async checkSourceDir(sourceDir) {
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
     * Check source file
     * @param {SourceDir} sourceFile
     * @returns {Promise<array>}
     */
    async checkSourceFile(sourceFile) {
        logger.info(`checkSourceFile('${sourceFile.relativePath}') ...`);
        const errors = [];

        if ([FileType.DIRECTORY, FileType.STATIC].includes(sourceFile.type)) {
            logger.info(`checkSourceFile('${sourceFile.relativePath}') : SKIPPED (type=${sourceFile.type})`);
            return errors;
        }

        // render content to html
        let htmlContent = sourceFile.getContentRaw();
        if (FileType.MARKDOWN === sourceFile.type) {
            htmlContent = render(htmlContent);
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
     * @private
     *
     * @param {SourceFile} sourceFile
     * @param {object} link
     * @return {Promise<object|null>}
     */
    async checkLink(sourceFile, link) {
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
     * Check targetUrl as an external link performing a GET request.
     *
     * @param {SourceFile} sourceFile
     * @param {string} targetUrl
     * @return {object|null}
     */
    async checkExternalLink(sourceFile, targetUrl) {
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
     *
     * @param {SourceFile} sourceFile
     * @param {string} targetUrl
     * @return {object|null}
     */
    checkInternalLink(sourceFile, targetUrl) {
        logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`);
        const absoluteTargetPath = path.resolve(path.dirname(sourceFile.absolutePath), targetUrl);
        const found = fs.existsSync(absoluteTargetPath);
        const expectedPath = sourceFile.sourceDir.getRelativePath(absoluteTargetPath);
        if (found) {
            logger.info(`checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS ('${expectedPath}' found)`);
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

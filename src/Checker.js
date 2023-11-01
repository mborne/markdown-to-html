const debug = require('debug')('markdown-to-html');

const SourceDir = require('./SourceDir');
const fs = require('fs');
const url = require('url');
const path = require('path');
const markdown = require('./markdown');
const FileType = require('./FileType');
const getMetadata = require('./html/getMetadata');
const checkUrlExists = require('./helpers/checkUrlExists');

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
class Checker {
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
        debug(`checkSourceDir(${sourceDir.absolutePath}) ...`);

        let errors = [];
        const sourceFiles = sourceDir.findFiles();
        debug(
            `checkSourceDir(${sourceDir.absolutePath}) : found ${sourceFiles.length} file(s)...`
        );
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
        debug(`checkSourceFile('${sourceFile.relativePath}') ...`);
        const errors = [];

        if ([FileType.DIRECTORY, FileType.STATIC].includes(sourceFile.type)) {
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
        if (links.length == 0) {
            debug(
                `checkSourceFile('${sourceFile.relativePath}') : SKIPPED (no links found)`
            );
            return errors;
        }

        debug(
            `checkSourceFile('${sourceFile.relativePath}') : ${links.length} link(s) found...`
        );
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
     *
     * @param {SourceFile} sourceFile
     * @param {string} targetUrl
     * @return {object|null}
     */
    checkInternalLink(sourceFile, targetUrl) {
        debug(
            `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') ...`
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
                `checkExternalLink('${sourceFile.relativePath}','${targetUrl}') : SUCCESS ('${expectedPath}' found)`
            );
            return null;
        } else {
            debug(
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

module.exports = Checker;

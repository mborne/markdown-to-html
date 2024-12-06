import { logger } from '../logger.js';

import shell from 'shelljs';
import fs, { mkdirSync } from 'fs';

import { Renderer } from '../Renderer.js';
import { SourceDir } from '../SourceDir.js';
import { Layout } from '../Layout.js';
import { FileType } from '../SourceFile.js';
import renamePathToHtml from '../helpers/renamePathToHtml.js';

/**
 * @typedef {Object} ConvertOptions
 * @property {string} language language for HTML pages defaulted to "en"
 * @property {boolean} force force overwrite existing output dir if it exists
 */

/**
 * Convert MD files in rootDir to outputDir
 *
 * @param {String} sourceDirPath path to source directory
 * @param {String} outputDirPath path to output directory
 * @param {String} layoutPath path to layout directory
 * @param {ConvertOptions} options
 */
export default function convert(sourceDirPath, outputDirPath, layoutPath, options) {
    /* output directory */
    logger.info("Check if outputDir exists...");
    if (fs.existsSync(outputDirPath)) {
        if (options.force) {
            logger.info("Cleanup existing outputDir (--force)");
            shell.rm('-rf', `${outputDirPath}/*`);
        } else {
            throw new Error(outputDirPath + ' already exists!');
        }
    }
    mkdirSync(outputDirPath, { recursive: true });
    shell.mkdir('-p', outputDirPath);

    const sourceDir = new SourceDir(sourceDirPath);
    const layout = new Layout(layoutPath);

    options = options || {};
    // force renaming of links from .md to .html
    options.renameLinksToHtml = true;
    const markdownRenderer = new Renderer(sourceDir, layout, options);

    logger.info(`List files from source directory ...`);
    const sourceFiles = sourceDir.findFiles();

    logger.info(`Copy assets from layout ...`);
    if (layout.hasAssets()) {
        const assertsDir = outputDirPath + '/assets';
        shell.cp('-r', layoutPath + '/assets', assertsDir);
    }

    logger.info(`Create directories ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.DIRECTORY;
        })
        .forEach(function (file) {
            const outputPath = outputDirPath + '/' + file.relativePath;
            logger.info(`Create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    logger.info(`Copy static files ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.STATIC;
        })
        .forEach(function (file) {
            const outputPath = outputDirPath + '/' + file.relativePath;
            logger.info(`Copy ${file.absolutePath} to ${outputPath} ...`);
            shell.cp(file.absolutePath, outputPath);
        });

    logger.info(`Render markdown files and html views ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.MARKDOWN || file.type === FileType.PHTML;
        })
        .forEach(function (file) {
            let outputPath = outputDirPath + '/' + file.relativePath;
            outputPath = renamePathToHtml(outputPath);
            logger.info(`Render ${file.absolutePath} to ${outputPath} ...`);
            const html = markdownRenderer.render(file);
            fs.writeFileSync(outputPath, html);
        });

    logger.info(`Render completed`);
}

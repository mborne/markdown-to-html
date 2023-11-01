const debug = require('debug')('markdown-to-html');

const shell = require('shelljs');
const fs = require('fs');
const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');
const Layout = require('../Layout');
const renamePathToHtml = require('../helpers/renamePathToHtml');
const FileType = require('../FileType');

/**
 * Convert MD files in rootDir to outputDir
 *
 * @param {String} sourceDirPath path to source directory
 * @param {String} outputDirPath path to output directory
 * @param {String} layoutPath path to layout directory
 * @param {Object} options
 * @param {string} options.language language for HTML pages defaulted to "en"
 */
function convert(sourceDirPath, outputDirPath, layoutPath, options) {
    /* output directory */
    debug("Ensure that outputDir doesn't exists...");
    if (fs.existsSync(outputDirPath)) {
        throw new Error(outputDirPath + ' already exists!');
    }
    shell.mkdir('-p', outputDirPath);

    debug(`Create renderer ...`);
    const sourceDir = new SourceDir(sourceDirPath);
    const layout = new Layout(layoutPath);

    options = options || {};
    // force renaming of links from .md to .html
    options.renameLinksToHtml = true;
    const markdownRenderer = new Renderer(sourceDir, layout, options);

    debug(`List files from source directory ...`);
    const sourceFiles = sourceDir.findFiles();

    debug(`Copy assets from layout ...`);
    if (layout.hasAssets()) {
        const assertsDir = outputDirPath + '/assets';
        shell.cp('-r', layoutPath + '/assets', assertsDir);
    }

    debug(`Create directories ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.DIRECTORY;
        })
        .forEach(function (file) {
            const outputPath = outputDirPath + '/' + file.relativePath;
            debug(`Create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    debug(`Copy static files ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.STATIC;
        })
        .forEach(function (file) {
            const outputPath = outputDirPath + '/' + file.relativePath;
            debug(`Copy ${file.absolutePath} to ${outputPath} ...`);
            shell.cp(file.absolutePath, outputPath);
        });

    debug(`Render markdown files and html views ...`);
    sourceFiles
        .filter(function (file) {
            return (
                file.type === FileType.MARKDOWN || file.type === FileType.PHTML
            );
        })
        .forEach(function (file) {
            let outputPath = outputDirPath + '/' + file.relativePath;
            outputPath = renamePathToHtml(outputPath);
            debug(`Render ${file.absolutePath} to ${outputPath} ...`);
            const html = markdownRenderer.render(file);
            fs.writeFileSync(outputPath, html);
        });

    debug(`Render completed`);
}

module.exports = convert;

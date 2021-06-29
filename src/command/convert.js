const debug = require('debug')('markdown-to-html');

const shell = require('shelljs');
const fs = require('fs');
const MarkdownRenderer = require('../MarkdownRenderer');
const SourceDir = require('../SourceDir');

const findFiles = require('../helpers/findFiles');
const checkOutputDir = require('./checks/checkOutputDir');
const checkLayoutPath = require('./checks/checkLayoutPath');

/**
 * Convert MD files in rootDir to outputDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function convert(options) {
    /* root directory */
    const sourceDir = new SourceDir(options.rootDir);

    /* output directory */
    const outputDir = options.outputDir;
    checkOutputDir(outputDir);
    shell.mkdir('-p', outputDir);

    /* template path */
    checkLayoutPath(options.layoutPath);

    /* Create renderer */
    var markdownRenderer = new MarkdownRenderer(options);

    /* Computes files to perform (before copying assets) */
    var files = sourceDir.findFiles();

    /* Copy assets */
    if (fs.existsSync(options.layoutPath + '/assets')) {
        const assertsDir = outputDir + '/assets';
        shell.cp('-r', options.layoutPath + '/assets', assertsDir);
    }

    debug(`Create directories ...`);
    files
        .filter(function (file) {
            return file.type === 'directory';
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.outputRelativePath;
            debug(`create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    debug(`Copy static files ...`);
    files
        .filter(function (file) {
            return file.type === 'static';
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.outputRelativePath;
            debug(`Copy ${file.path} to ${outputPath} ...`);
            shell.cp(file.path, outputPath);
        });

    debug(`Render markdown files and html views ...`);
    files
        .filter(function (file) {
            return file.type === 'md' || file.type === 'html';
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.outputRelativePath;
            debug(`Render ${file.path} to ${outputPath} ...`);
            var html = markdownRenderer.renderFile(file.path);
            fs.writeFileSync(outputPath, html);
        });
}

module.exports = convert;

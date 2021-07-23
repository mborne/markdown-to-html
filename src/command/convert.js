const debug = require('debug')('markdown-to-html');

const shell = require('shelljs');
const fs = require('fs');
const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');

const checkLayoutPath = require('./checks/checkLayoutPath');
const renameMdToHtml = require('../helpers/renameMdToHtml');

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
    if (fs.existsSync(outputDir)) {
        throw new Error(outputDir + ' already exists!');
    }
    shell.mkdir('-p', outputDir);

    /* template path */
    checkLayoutPath(options.layoutPath);

    /* Create renderer */
    options.mode = 'convert';
    var markdownRenderer = new Renderer(options);

    /* Computes files to perform (before copying assets) */
    var sourceFiles = sourceDir.findFiles();

    debug(`Copy assets from layout ...`);
    if (fs.existsSync(options.layoutPath + '/assets')) {
        const assertsDir = outputDir + '/assets';
        shell.cp('-r', options.layoutPath + '/assets', assertsDir);
    }

    debug(`Create directories ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === 'directory';
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.relativePath;
            debug(`Create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    debug(`Copy static files ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === 'static';
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.relativePath;
            debug(`Copy ${file.absolutePath} to ${outputPath} ...`);
            shell.cp(file.absolutePath, outputPath);
        });

    debug(`Render markdown files and html views ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === 'md' || file.type === 'html';
        })
        .forEach(function (file) {
            let outputPath = outputDir + '/' + file.relativePath;
            if (file.type == 'md') {
                outputPath = renameMdToHtml(outputPath);
            }
            debug(`Render ${file.absolutePath} to ${outputPath} ...`);
            var html = markdownRenderer.render(file);
            fs.writeFileSync(outputPath, html);
        });

    debug(`Render completed`);
}

module.exports = convert;


const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const MarkdownRenderer = require('../MarkdownRenderer');
const findFiles = require('../helpers/findFiles');

/**
 * Convert MD files in rootDir to outputDir
 * @param {Object} options
 * @param {String} options.rootDir
 * @param {String} options.outputDir
 */
function convert(options) {
    /* root directory */
    const rootDir = options.rootDir;
    if (!fs.existsSync(rootDir)) {
        throw new Error("Input file not found");
    }
    if (!fs.lstatSync(rootDir).isDirectory()) {
        throw new Error("Input file is not a directory");
    }

    /* output directory */
    const outputDir = options.outputDir;
    if (fs.existsSync(outputDir)) {
        throw new Error(outputDir + "already exists!");
    }
    shell.mkdir('-p', outputDir);

    /* template path */
    const layoutPath = options.layoutPath;

    /* Create renderer */
    var markdownRenderer = new MarkdownRenderer(
        rootDir,
        layoutPath
    );

    /* Computes files to perform (before copying assets) */
    var files = findFiles(markdownRenderer.rootDir);

    /* Copy assets */
    const assertsDir = outputDir + '/assets';
    shell.cp('-r', layoutPath + '/assets', assertsDir);

    /* Create directories */
    files.filter(function (file) { return file.type === 'directory' }).forEach(function (file) {
        const outputPath = outputDir+'/'+file.outputRelativePath;
        console.log("mkdir " + outputPath);
        shell.mkdir("-p", outputPath);
    });

    /* Copy static files */
    files.filter(function (file) { return file.type === 'static' }).forEach(function (file) {
        const outputPath = outputDir+'/'+file.outputRelativePath;
        console.log("copy " + file.path + " to " + outputPath);
        shell.cp(file.path, outputPath);
    });

    /* Render markdown files */
    files.filter(function (file) { return file.type === 'md' }).forEach(function (file) {
        const outputPath = outputDir+'/'+file.outputRelativePath;
        console.log("render " + file.path + " to " + outputPath);
        var html = markdownRenderer.renderFile(file.path);
        fs.writeFileSync(outputPath, html);
    });
}

module.exports = convert;

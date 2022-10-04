const debug = require('debug')('markdown-to-html');

const shell = require('shelljs');
const fs = require('fs');
const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');
const Layout = require('../Layout');
const renameMdToHtml = require('../helpers/renameMdToHtml');
const renameViewToHtml = require('../helpers/renameViewToHtml');
const FileType = require('../FileType');

/**
 * Convert MD files in rootDir to outputDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function convert(options) {
    /* output directory */
    debug("Ensure that outputDir doesn't exists...");
    const outputDir = options.outputDir;
    if (fs.existsSync(outputDir)) {
        throw new Error(outputDir + ' already exists!');
    }
    shell.mkdir('-p', outputDir);

    debug(`Create renderer ...`);
    const sourceDir = new SourceDir(options.rootDir);
    const layout = new Layout(options.layoutPath);
    var markdownRenderer = new Renderer(sourceDir, layout, {
        mode: 'convert',
    });

    debug(`List files from source directory ...`);
    var sourceFiles = sourceDir.findFiles();

    debug(`Copy assets from layout ...`);
    if (layout.hasAssets()) {
        const assertsDir = outputDir + '/assets';
        shell.cp('-r', options.layoutPath + '/assets', assertsDir);
    }

    debug(`Create directories ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.DIRECTORY;
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.relativePath;
            debug(`Create directory ${outputPath} ...`);
            shell.mkdir('-p', outputPath);
        });

    debug(`Copy static files ...`);
    sourceFiles
        .filter(function (file) {
            return file.type === FileType.STATIC;
        })
        .forEach(function (file) {
            const outputPath = outputDir + '/' + file.relativePath;
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
            let outputPath = outputDir + '/' + file.relativePath;
            if (file.type == FileType.MARKDOWN) {
                outputPath = renameMdToHtml(outputPath);
            } else if (file.type == FileType.PHTML) {
                outputPath = renameViewToHtml(outputPath);
            }
            debug(`Render ${file.absolutePath} to ${outputPath} ...`);
            var html = markdownRenderer.render(file);
            fs.writeFileSync(outputPath, html);
        });

    debug(`Render completed`);
}

module.exports = convert;

const express = require('express');

const MarkdownRenderer = require('../MarkdownRenderer');
const SourceDir = require('../SourceDir');
const checkLayoutPath = require('./checks/checkLayoutPath');

const url = require('url');
const path = require('path');

/**
 * Serve MD files from rootDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function serve(options) {
    /* root directory */
    const sourceDir = new SourceDir(options.rootDir);

    /* template path */
    const layoutPath = options.layoutPath;
    checkLayoutPath(layoutPath);

    /* Create renderer */
    var markdownRenderer = new MarkdownRenderer(options);

    const app = express();

    app.use('/assets', express.static(layoutPath + '/assets'));

    app.get(/^\/(.*)/, function (req, res) {
        var relativePath = req.params[0];
        var absolutePath = sourceDir.locateFile(relativePath);
        if (absolutePath != null) {
            var parsed = url.parse(absolutePath);
            var ext = path.extname(parsed.pathname || '');
            if (ext === '.md' || ext === '.html') {
                res.send(markdownRenderer.renderFile(absolutePath));
            } else {
                res.sendFile(absolutePath);
            }
        } else {
            res.status(404).send('Not found');
        }
    });

    app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

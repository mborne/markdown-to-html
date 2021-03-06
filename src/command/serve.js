const express = require('express');

const MarkdownRenderer = require('../MarkdownRenderer');
const checkRootDir = require('./checks/checkRootDir');
const checkLayoutPath = require('./checks/checkLayoutPath');

const url = require('url');
const path = require('path');
const locateFile = require('../helpers/locateFile');

/**
 * Serve MD files from rootDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function serve(options) {
    /* root directory */
    const rootDir = options.rootDir;
    checkRootDir(rootDir);

    /* template path */
    const layoutPath = options.layoutPath;
    checkLayoutPath(layoutPath);

    /* Create renderer */
    var markdownRenderer = new MarkdownRenderer(options);

    const app = express();

    app.use('/assets', express.static(layoutPath + '/assets'));

    app.get(/^\/(.*)/, function(req, res) {
        var href = req.params[0];
        var file = locateFile(rootDir, href);
        if (file != null) {
            var parsed = url.parse(file);
            var ext = path.extname(parsed.pathname || '');
            if (ext === '.md' || ext === '.html') {
                res.send(markdownRenderer.renderFile(file));
            } else {
                res.sendFile(file);
            }
        } else {
            res.status(404).send('Not found');
        }
    });

    app.listen(3000, function() {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

const express = require('express');

const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');

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

    /* Create renderer */
    var markdownRenderer = new Renderer(options);

    const app = express();

    app.use('/assets', express.static(layoutPath + '/assets'));

    app.get(/^\/(.*)/, function (req, res) {
        let relativePath = req.params[0];
        let sourceFile = sourceDir.locateFile(relativePath);
        if (sourceFile == null) {
            res.status(404).send('Not found');
            return;
        }
        if (sourceFile.type == 'directory') {
            let indexFile = sourceDir.locateIndex(sourceFile);
            if (indexFile == null) {
                res.status(404).send('Not found');
                return;
            }
            res.send(markdownRenderer.render(indexFile));
            return;
        }
        if (['md', 'html'].includes(sourceFile.type)) {
            res.send(markdownRenderer.render(sourceFile));
        } else {
            res.sendFile(sourceFile.absolutePath);
        }
    });

    app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

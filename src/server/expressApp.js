const express = require('express');

const morgan = require('morgan');

const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');
const Layout = require('../Layout');

/**
 * Create express app to serve a directory containing mardown files.
 *
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.layoutPath path to layout directory
 */
function expressApp(options) {
    const sourceDir = new SourceDir(options.rootDir);
    const layout = new Layout(options.layoutPath);
    var renderer = new Renderer(sourceDir, layout, {
        mode: 'serve',
    });

    const app = express();

    // see https://github.com/expressjs/morgan#predefined-formats
    app.use(morgan('tiny'));

    if (layout.hasAssets()) {
        app.use('/assets', express.static(layout.path + '/assets'));
    }

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
            res.send(renderer.render(indexFile));
            return;
        }
        if (['md', 'html'].includes(sourceFile.type)) {
            res.send(renderer.render(sourceFile));
        } else {
            res.sendFile(sourceFile.absolutePath);
        }
    });

    return app;
}

module.exports = expressApp;

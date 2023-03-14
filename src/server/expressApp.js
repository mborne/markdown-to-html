const express = require('express');

const morgan = require('morgan');

const Renderer = require('../Renderer');
const SourceDir = require('../SourceDir');
const Layout = require('../Layout');

const url = require('url');
const FileType = require('../FileType');

/**
 * Create express app to serve a directory containing mardown files.
 *
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.layoutPath path to layout directory
 */
function expressApp(options) {
    const app = express();

    /*
     * log requests
     * see https://github.com/expressjs/morgan#predefined-formats
     */
    app.use(morgan('tiny'));

    const sourceDir = new SourceDir(options.rootDir);
    const layout = new Layout(options.layoutPath);
    const renderer = new Renderer(sourceDir, layout, {
        renameLinksToHtml: false,
    });

    /*
     * serve layout's assets
     */
    if (layout.hasAssets()) {
        app.use('/assets', express.static(layout.path + '/assets'));
    }

    /*
     * server files
     */
    app.get(/^\/(.*)/, function (req, res) {
        let relativePath = req.params[0];
        let sourceFile = sourceDir.locateFile(relativePath);
        if (sourceFile == null) {
            res.status(404).send('Not found');
            return;
        }

        if (sourceFile.type == FileType.DIRECTORY) {
            // ensure URL has a trailing slash
            if (relativePath != '' && relativePath != '/') {
                let parsed = url.parse(relativePath);
                if (!parsed.path.endsWith('/')) {
                    res.redirect(parsed.path + '/');
                    return;
                }
            }

            // render index file
            let indexFile = sourceDir.locateIndex(sourceFile);
            if (indexFile == null) {
                res.status(404).send('Not found');
                return;
            }
            sourceFile = indexFile;
        }

        if ([FileType.MARKDOWN, FileType.PHTML].includes(sourceFile.type)) {
            res.send(renderer.render(sourceFile));
        } else {
            res.sendFile(sourceFile.absolutePath);
        }
    });

    return app;
}

module.exports = expressApp;

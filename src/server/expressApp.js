import express from 'express';

import morgan from 'morgan';

import url from 'url';

import { Renderer } from '../Renderer.js';
import { SourceDir } from '../SourceDir.js';
import { Layout } from '../Layout.js';
import { FileType } from '../SourceFile.js';

/**
 * Create express app to serve a directory containing mardown files.
 *
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 * @param {Object|undefined} options
 * @param {string} options.language language for HTML pages defaulted to "en"
 */
export default function expressApp(sourceDirPath, layoutPath, options) {
    const app = express();

    /*
     * log requests
     * see https://github.com/expressjs/morgan#predefined-formats
     */
    app.use(morgan('tiny'));

    const sourceDir = new SourceDir(sourceDirPath);
    const layout = new Layout(layoutPath);

    /*
     * disable renaming of links from .md to .html
     * see https://github.com/mborne/markdown-to-html/issues/28
     */
    options = options || {};
    options.renameLinksToHtml = false;

    const renderer = new Renderer(sourceDir, layout, options);

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

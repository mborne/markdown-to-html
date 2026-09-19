import express from 'express';
import morgan from 'morgan';

import Renderer from '../Renderer.js';
import SourceDir from '../SourceDir.js';
import Layout from '../Layout.js';
import FileType from '../FileType.js';

import type { RenderOptions } from '../types.js';

/**
 * Create express app to serve a directory containing mardown files.
 */
export default function expressApp(
    sourceDirPath: string,
    layoutPath: string,
    options: RenderOptions = {}
): express.Express {
    const app = express();

    /*
     * log requests
     * see https://github.com/expressjs/morgan#predefined-formats
     */
    app.use(morgan('tiny'));

    const sourceDir = new SourceDir(sourceDirPath);
    const layout = new Layout(layoutPath);

    const renderer = new Renderer(sourceDir, layout, {
        ...options,
        /*
         * disable renaming of links from .md to .html
         * see https://github.com/mborne/markdown-to-html/issues/28
         */
        renameLinksToHtml: false,
    });

    /*
     * serve layout's assets
     */
    if (layout.hasAssets()) {
        app.use('/assets', express.static(layout.assetsPath));
    }

    /*
     * server files
     */
    app.get(/^\/(.*)/, function (req, res) {
        const relativePath = req.params[0] ?? '';
        let sourceFile = sourceDir.locateFile(relativePath);
        if (sourceFile === null) {
            res.status(404).send('Not found');
            return;
        }

        if (sourceFile.type === FileType.DIRECTORY) {
            // ensure URL has a trailing slash
            if (relativePath !== '' && !relativePath.endsWith('/')) {
                res.redirect(relativePath + '/');
                return;
            }

            // render index file
            const indexFile = sourceDir.locateIndex(sourceFile);
            if (indexFile === null) {
                res.status(404).send('Not found');
                return;
            }
            sourceFile = indexFile;
        }

        if (
            sourceFile.type === FileType.MARKDOWN ||
            sourceFile.type === FileType.PHTML
        ) {
            res.send(renderer.render(sourceFile));
        } else {
            res.sendFile(sourceFile.absolutePath);
        }
    });

    return app;
}

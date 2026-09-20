import createDebug from 'debug';

import expressApp from '../server/expressApp.js';

import type { RenderOptions } from '../types.js';

const debug = createDebug('markdown-to-html');

/**
 * Serve MD files from sourceDirPath
 */
export default function serve(
    sourceDirPath: string,
    layoutPath: string,
    options: RenderOptions = {}
): void {
    const app = expressApp(sourceDirPath, layoutPath, options);

    const server = app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });

    process.on('SIGTERM', () => {
        debug('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            debug('HTTP server closed');
        });
    });
}

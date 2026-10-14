import createDebug from 'debug';

import expressApp from '../server/expressApp.js';

import type { ServeOptions } from '../types.js';

const debug = createDebug('markdown-to-html');

/**
 * Serve MD files from sourceDirPath
 */
export default function serve(
    sourceDirPath: string,
    layoutPath: string,
    options: ServeOptions = {}
): void {
    const { host = '127.0.0.1', ...renderOptions } = options;
    const app = expressApp(sourceDirPath, layoutPath, renderOptions);

    /*
     * listen on the loopback interface by default so that the served
     * directory is not exposed to the network unless explicitly requested.
     */
    const server = app.listen(3000, host, function () {
        console.log(`Application started on http://${host}:3000`);
    });

    process.on('SIGTERM', () => {
        debug('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            debug('HTTP server closed');
        });
    });
}

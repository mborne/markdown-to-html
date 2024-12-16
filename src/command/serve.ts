import { logger } from '../logger';

import expressApp from '../server/expressApp';

interface ServeOptions {
    /**
     * language for HTML pages defaulted to "en"
     */
    language?: string;
}

/**
 * Serve MD files from rootDir
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 * @param {ServeOptions} options
 */
export function serve(sourceDirPath: string, layoutPath: string, options: ServeOptions) {
    const app = expressApp(sourceDirPath, layoutPath, options);

    const server = app.listen(3000, function () {
        logger.info('Application started on http://localhost:3000');
    });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            logger.info('HTTP server closed');
        });
    });
}

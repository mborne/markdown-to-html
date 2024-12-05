import debug from 'debug';
import expressApp from '../server/expressApp.js';

/**
 * @typedef {Object} ServeOptions
 * @property {string} language language for HTML pages defaulted to "en"
 */

/**
 * Serve MD files from rootDir
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 * @param {ServeOptions} options
 */
export default function serve(sourceDirPath, layoutPath, options) {
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

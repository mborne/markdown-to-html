const expressApp = require('../server/expressApp');

/**
 * Serve MD files from rootDir
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 * @param {Object} options
 * @param {string} options.language language for HTML pages defaulted to "en"
 */
function serve(sourceDirPath, layoutPath, options) {
    const app = expressApp(sourceDirPath, layoutPath, options);

    app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

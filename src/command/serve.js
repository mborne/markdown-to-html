const expressApp = require('../server/expressApp');

/**
 * Serve MD files from rootDir
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 */
function serve(sourceDirPath, layoutPath) {
    const app = expressApp(sourceDirPath, layoutPath);

    app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

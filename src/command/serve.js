const expressApp = require('../server/expressApp');

/**
 * Serve MD files from rootDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.layoutPath path to layout directory
 */
function serve(options) {
    const app = expressApp(options);

    app.listen(3000, function () {
        console.log('Application started on http://localhost:3000');
    });
}

module.exports = serve;

const handlebars = require('handlebars');
const path = require('path');

/**
 * Handlebars helper providing a way to compute relative URL to rendered source {{url '/index.html'}}.
 *
 * @param {string} context
 * @param {Object} options
 */
module.exports = function (context, options) {
    const parentDir = path.resolve(options.data.root.path, '..');
    const targetPath = path.resolve(
        options.data.root.rootDir,
        context.replace(/^\//, '')
    );
    const relativeTargetPath = path.relative(parentDir, targetPath);
    const relativeUrl = relativeTargetPath.endsWith('..')
        ? relativeTargetPath + '/'
        : relativeTargetPath;
    return new handlebars.SafeString(relativeUrl);
};

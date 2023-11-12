const handlebars = require('handlebars');
const path = require('path');

/**
 * Handlebars helper providing a way to compute relative URL from rendered file to a given path
 *
 * Note that {{url '.'}} provides relative URL to rootDir.
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

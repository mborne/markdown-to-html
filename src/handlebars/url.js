import path from 'path';
import handlebars from 'handlebars';

/**
 * Handlebars helper providing a way to compute relative URL from rendered file to a given path
 *
 * Note that {{url '.'}} provides relative URL to rootDir.
 *
 * @param {string} context
 * @param {Object} options
 */
export function url(context, options) {
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
}

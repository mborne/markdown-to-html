import path from 'path';
import handlebars from 'handlebars';

/**
 * Handlebars helper providing {{asset 'highlight/styles/github.css'}}.
 *
 * @param {string} context
 * @param {Object} options
 */
export function asset(context, options) {
    const parentDir = path.resolve(options.data.root.path, '..');
    const relativePath = path.relative(parentDir, options.data.root.rootDir + '/assets');

    let output = '';
    output += relativePath + '/';
    context = context.replace(/^\//, '');
    output += context;

    return new handlebars.SafeString(output);
}

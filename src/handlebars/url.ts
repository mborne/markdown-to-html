import handlebars from 'handlebars';
import path from 'node:path';

import type { RenderContext } from '../types.js';

/**
 * Handlebars helper providing a way to compute relative URL from rendered file to a given path
 *
 * Note that {{url '.'}} provides relative URL to rootDir.
 */
export default function url(
    context: string,
    options: handlebars.HelperOptions
): handlebars.SafeString {
    const { root } = options.data as { root: RenderContext };
    const parentDir = path.resolve(root.path, '..');
    const targetPath = path.resolve(root.rootDir, context.replace(/^\//, ''));
    const relativeTargetPath = path.relative(parentDir, targetPath);
    const relativeUrl = relativeTargetPath.endsWith('..')
        ? relativeTargetPath + '/'
        : relativeTargetPath;
    return new handlebars.SafeString(relativeUrl);
}

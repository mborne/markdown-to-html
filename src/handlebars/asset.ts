import handlebars from 'handlebars';
import path from 'node:path';

import type { RenderContext } from '../types.js';

/**
 * Handlebars helper providing {{asset 'highlight/styles/github.css'}}.
 */
export default function asset(
    context: string,
    options: handlebars.HelperOptions
): handlebars.SafeString {
    const { root } = options.data as { root: RenderContext };
    const parentDir = path.resolve(root.path, '..');
    const relativePath = path.relative(parentDir, root.rootDir + '/assets');

    return new handlebars.SafeString(
        relativePath + '/' + context.replace(/^\//, '')
    );
}

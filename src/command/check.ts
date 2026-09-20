import createDebug from 'debug';

import SourceDir from '../SourceDir.js';
import Checker from '../Checker.js';

import type { CheckerOptions } from '../Checker.js';

const debug = createDebug('markdown-to-html');

/**
 * An helper script to detect dead links in .md or .phtml files.
 */
export default async function check(
    sourceDirPath: string,
    options: CheckerOptions = {}
): Promise<void> {
    debug(`check('${sourceDirPath}',${JSON.stringify(options)}...)`);
    const sourceDir = new SourceDir(sourceDirPath);
    const checker = new Checker(options);

    const errors = await checker.checkSourceDir(sourceDir);
    if (errors.length !== 0) {
        const details = errors
            .map((error, index) => `- ${index + 1}) ${error.message}`)
            .join('\r\n');
        throw new Error(`Found ${errors.length} dead link(s) : \r\n${details}`);
    } else {
        console.log('SUCCESS : No dead link found');
    }
}

import { logger } from '../logger.js';

import { SourceDir } from '../SourceDir.js';
import { Checker } from '../Checker.js';

/**
 * @typedef {Object} CheckOptions
 * @property {boolean} checkExternalLinks perform request to check external links?
 */

/**
 * An helper script to detect dead links in .md or .phtml files.
 *
 * @param {String} sourceDirPath path to source directory
 * @param {CheckOptions} options
 */
export default async function check(sourceDirPath, options) {
    logger.info(`check('${sourceDirPath}',${JSON.stringify(options)}...)`);
    const sourceDir = new SourceDir(sourceDirPath);
    const checker = new Checker(options);

    const errors = await checker.checkSourceDir(sourceDir);
    if (errors.length != 0) {
        const details = errors
            .map((error, index) => {
                return `- ${index + 1}) ${error.message}`;
            })
            .join('\r\n');
        throw new Error(`Found ${errors.length} dead link(s) : \r\n${details}`);
    } else {
        logger.info('SUCCESS : No dead link found');
    }
}

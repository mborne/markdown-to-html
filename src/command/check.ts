import { logger } from '../logger';

import { SourceDir } from '../SourceDir';
import { Checker, CheckerOptions } from '../Checker';

/**
 * An helper script to detect dead links in .md or .phtml files.
 * @param sourceDirPath path to the directory containing .md or .phtml files.
 * @param options checker options.
 */
export async function check(sourceDirPath: string, options: CheckerOptions) {
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

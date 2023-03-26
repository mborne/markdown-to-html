const debug = require('debug')('markdown-to-html');

const SourceDir = require('../SourceDir');
const Checker = require('../Checker');

/**
 * An helper script to detect dead links in .md or .phtml files.
 *
 * @param {String} sourceDirPath path to source directory
 * @param {object} options
 * @param {boolean} options.checkExternalLinks perform request to check external links?
 */
async function check(sourceDirPath, options) {
    debug(`check('${sourceDirPath}',${JSON.stringify(options)}...)`);
    const sourceDir = new SourceDir(sourceDirPath);
    const checker = new Checker(options);

    let errors = await checker.checkSourceDir(sourceDir);
    if (errors.length != 0) {
        const details = errors
            .map((error, index) => {
                return `- ${index + 1}) ${error.message}`;
            })
            .join('\r\n');
        throw new Error(`Found ${errors.length} dead link(s) : \r\n${details}`);
    } else {
        console.log('SUCCESS : No dead link found');
    }
}

module.exports = check;

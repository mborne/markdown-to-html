const debug = require('debug')('markdown-to-html');

const fs = require('fs');
const url = require('url');
const path = require('path');
const SourceDir = require('../SourceDir');

const markdown = require('../markdown');
const FileType = require('../FileType');
const getLinks = require('../html/getLinks');

/**
 * An helper script to detect dead links in .md or .phtml files.
 *
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function check(options) {
    debug(`Check source directory ...`);
    const sourceDir = new SourceDir(options.rootDir);

    let deadLinkCount = 0;

    debug(`List files from source directory ...`);
    const sourceFiles = sourceDir.findFiles();
    for (const sourceFile of sourceFiles) {
        if ([FileType.DIRECTORY, FileType.STATIC].includes(sourceFile.type)) {
            debug(
                `-- ${sourceFile.relativePath} : SKIPPED (type=${sourceFile.type})`
            );
            continue;
        }

        // render content to html
        let htmlContent = sourceFile.getContentRaw();
        if (FileType.MARKDOWN === sourceFile.type) {
            htmlContent = markdown.render(htmlContent);
        }

        // get links from html
        const links = getLinks(htmlContent);
        if (links.length == 0) {
            debug(`-- ${sourceFile.relativePath} : SKIPPED (no links found)`);
            continue;
        }
        for (const link of links) {
            link.sourcePath = sourceDir.getRelativePath(
                sourceFile.absolutePath
            );

            const href = link.href;
            if (href.startsWith('#')) {
                debug(
                    `-- ${sourceFile.relativePath} -> '${link.href}' : SKIPPED (heading link)`
                );
                continue;
            }
            const parsed = url.parse(href);
            if (parsed.protocol !== null) {
                debug(
                    `-- ${sourceFile.relativePath} -> '${link.href}' : SKIPPED (external link)`
                );
                continue;
            }

            const absoluteTargetPath = path.resolve(
                path.dirname(sourceFile.absolutePath),
                href
            );
            link.found = fs.existsSync(absoluteTargetPath);
            const expectedPath = sourceDir.getRelativePath(absoluteTargetPath);
            if (link.found) {
                debug(
                    `-- ${sourceFile.relativePath} -> '${link.href}': SUCCESS ('${expectedPath}' found)`
                );
            } else {
                console.error(
                    `-- ${sourceFile.relativePath} -> '${link.href}' : FAILURE ('${expectedPath}' not found)`
                );
                deadLinkCount++;
            }
        }
    }

    if (deadLinkCount != 0) {
        throw new Error(`found ${deadLinkCount} dead link(s)`);
    } else {
        console.log('SUCCESS : No dead link found');
    }

    debug(`check completed`);
}

module.exports = check;

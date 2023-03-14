const url = require('url');
const path = require('path');
const renamePathToHtml = require('./renamePathToHtml');

/**
 * Rewrite relative .md links to .html in markdown text.
 *
 * @param {string} text
 * @returns {string}
 */
function rewriteLinksToHtml(text) {
    return text.replace(/\[([^\[\]]*)\]\((.*?)\)/gm, function (link) {
        let parts = link.match(/\[([^\[\]]*)\]\((.*?)\)/);

        let title = parts[1];
        let href = parts[2];

        const parsed = url.parse(href);
        if (!parsed.protocol) {
            const ext = path.extname(parsed.pathname || '');
            if (ext === '.md' || ext === '.phtml') {
                parsed.pathname = renamePathToHtml(parsed.pathname);
                href = url.format(parsed);
            }
        }
        return `[${title}](${href})`;
    });
}

module.exports = rewriteLinksToHtml;

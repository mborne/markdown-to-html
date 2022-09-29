const url = require('url');
const path = require('path');
const renameMdToHtml = require('./renameMdToHtml');

/**
 *
 * @param {string} text
 * @returns {string}
 */
function rewriteLinksToHtml(text) {
    return text.replace(/\[([^\[\]]*)\]\((.*?)\)/gm, function (link) {
        let parts = link.match(/\[([^\[\]]*)\]\((.*?)\)/);

        let title = parts[1];
        let href = parts[2];

        var parsed = url.parse(href);
        if (!parsed.protocol) {
            var ext = path.extname(parsed.pathname || '');
            if (ext === '.md') {
                parsed.pathname = renameMdToHtml(parsed.pathname);
                href = url.format(parsed);
            }
        }
        return `[${title}](${href})`;
    });
}

module.exports = rewriteLinksToHtml;

const url = require('url');
const path = require('path');
const renameMdToHtml = require('../helpers/renameMdToHtml');

/**
 * marked - create custom method to render links with optional renaming from .md to .html.
 *
 * @param {boolean} renameMarkdownLinksToHtml
 * @returns {function}
 */
function link(renameMarkdownLinksToHtml) {
    return function doLink(href, title, text) {
        var parsed = url.parse(href);

        /* convert .md links to .html for non external links */
        var target = null;
        if (!parsed.protocol) {
            var ext = path.extname(parsed.pathname || '');
            if (renameMarkdownLinksToHtml && ext === '.md') {
                parsed.pathname = renameMdToHtml(parsed.pathname);
                href = url.format(parsed);
            }
        } else {
            target = '_blank';
        }

        var out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        if (target) {
            out += ' target="' + target + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };
}

module.exports = link;

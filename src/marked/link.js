const url = require('url');

/**
 * marked - create custom method to render links with optional renaming from .md to .html.
 *
 * @returns {function}
 */
function link() {
    return function doLink(href, title, text) {
        var parsed = url.parse(href);

        /* convert .md links to .html for non external links */
        var target = null;
        if (parsed.protocol != null) {
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

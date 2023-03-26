const url = require('url');

/**
 * marked - custom method to render link with a _blank target for external links.
 *
 * @private
 *
 * @returns {function}
 */
function link(href, title, text) {
    const parsed = url.parse(href);

    /* convert .md links to .html for non external links */
    let target = null;
    if (parsed.protocol != null) {
        target = '_blank';
    }

    let out = '<a href="' + href + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    if (target) {
        out += ' target="' + target + '"';
    }
    out += '>' + text + '</a>';
    return out;
}

module.exports = link;

const marked = require('./marked');

/**
 * Render markdown content to HTML.
 *
 * @param {string} markdownContent
 * @returns {string}
 */
function render(markdownContent) {
    /* render markdown to html */
    return marked.parse(markdownContent);
}

module.exports = render;

const marked = require('marked').marked;

const link = require('./link');
const heading = require('./heading');

const toc = require('./toc');

/**
 * Render markdown content to HTML.
 *
 * @param {string} markdownContent
 * @returns {string}
 */
function render(markdownContent) {
    const markedRenderer = new marked.Renderer();
    markedRenderer.link = link;
    markedRenderer.heading = heading;

    /* render table of content */
    markdownContent = markdownContent.replace('[[toc]]', toc(markdownContent));
    /* render markdown to html */
    return marked(markdownContent, {
        renderer: markedRenderer,
    });
}

module.exports = render;

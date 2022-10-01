const marked = require('marked').marked;

const link = require('./link');
const heading = require('./heading');

const toc = require('./toc');

/**
 * marked - customize marking rendering.
 */
class MarkdownRenderer {
    constructor() {
        this.markedRenderer = new marked.Renderer();
        this.markedRenderer.options.smartypants = true;
        this.markedRenderer.link = link;
        this.markedRenderer.heading = heading;
    }

    /**
     * Render markdown content to HTML.
     *
     * @param {string} markdownContent
     * @returns {string}
     */
    render(markdownContent) {
        /* render table of content */
        markdownContent = markdownContent.replace(
            '[[toc]]',
            toc(markdownContent)
        );
        /* render markdown to html */
        return marked(markdownContent, {
            renderer: this.markedRenderer,
        });
    }
}

module.exports = MarkdownRenderer;

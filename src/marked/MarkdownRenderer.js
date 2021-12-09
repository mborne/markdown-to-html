const marked = require('marked');

const toc = require('markdown-toc');
const slugify = require('./slugify');

const link = require('./link');
const heading = require('./heading');

/**
 * marked - customize marking rendering.
 */
class MarkdownRenderer {
    /**
     * @param {object} options
     * @param {boolean} options.renameMarkdownLinksToHtml allows to rename .md to .html for static rendering
     */
    constructor(options) {
        options = options || {};
        this.renameMarkdownLinksToHtml =
            options.renameMarkdownLinksToHtml || false;

        this.markedRenderer = new marked.Renderer();
        this.markedRenderer.link = link(this.renameMarkdownLinksToHtml);
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
            this.renderToc(markdownContent)
        );
        /* render markdown to html */
        return marked(markdownContent, {
            renderer: this.markedRenderer,
        });
    }

    /**
     * Render TOC according to markdown.
     *
     * @private
     *
     * @param {string} markdownContent markdown source
     */
    renderToc(markdownContent) {
        return toc(markdownContent, {
            /* ignore h1 titles */
            firsth1: false,
            /* ensure consistency with title */
            slugify: slugify,
        }).content;
    }
}

module.exports = MarkdownRenderer;

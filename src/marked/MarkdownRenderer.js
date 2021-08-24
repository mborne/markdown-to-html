const marked = require('marked');
const url = require('url');
const path = require('path');
const renameMdToHtml = require('../helpers/renameMdToHtml');
const slugify = require('../helpers/slugify');

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
        this.markedRenderer.link = this.link.bind(this);
        this.markedRenderer.heading = this.heading.bind(this);
    }

    /**
     * Render markdown content to HTML.
     *
     * @param {string} markdownContent
     * @returns {string}
     */
    render(markdownContent) {
        return marked(markdownContent, {
            renderer: this.markedRenderer,
        });
    }

    /**
     * marked - custom method to render links.
     *
     * @param {string} href
     * @param {string} title
     * @param {string} text
     * @returns {string}
     */
    link(href, title, text) {
        var parsed = url.parse(href);

        /* convert .md links to .html for non external links */
        var target = null;
        if (!parsed.protocol) {
            var ext = path.extname(parsed.pathname || '');
            if (this.renameMarkdownLinksToHtml && ext === '.md') {
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
    }

    /**
     * marked - custom method to render titles.
     *
     * @param {string} text
     * @param {string} level
     * @returns {string}
     */
    heading(text, level) {
        var slug = slugify(text);
        return (
            '<h' +
            level +
            ' id="' +
            slug +
            '"><a href="#' +
            slug +
            '" class="anchor"></a>' +
            text +
            '</h' +
            level +
            '>'
        );
    }
}

module.exports = MarkdownRenderer;

const marked = require('marked').marked;

const customHeadingId = require('marked-custom-heading-id');
marked.use(customHeadingId());

const slugify = require('./slugify');

const link = require('./link');
const heading = require('./heading');

// To be removed if token.id can't be forwarded to heading function...
const walkTokens = (token) => {
    const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;
    if (token.type == 'heading') {
        const hasId = token.text.match(headingIdRegex);
        if (!hasId) {
            token.id = slugify(token.text);
        } else {
            token.id = hasId[1];
            token.text = token.text.replace(headingIdRegex, '');
        }
    }
};

marked.use({ walkTokens });

/**
 * marked - customize marking rendering.
 */
class MarkdownRenderer {
    /**
     * @param {object} options
     */
    constructor(options) {
        options = options || {};

        this.markedRenderer = new marked.Renderer();
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
        let toc = this.renderToc(markdownContent);
        markdownContent = markdownContent.replace('[[toc]]', toc);
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
        const lexer = new marked.Lexer();
        let tokens = lexer.lex(markdownContent);
        let headingTokens = tokens.filter(
            (token) => token.depth != 1 && token.type == 'heading'
        );
        headingTokens.map(walkTokens);

        return headingTokens
            .map((token) => {
                let spaces = '';
                if (token.depth > 2) {
                    spaces = Array(2 * (token.depth - 2))
                        .fill('  ')
                        .join('');
                }
                return `${spaces}* [${token.text}](#${token.id})`;
            })
            .join('\n');
    }
}

module.exports = MarkdownRenderer;

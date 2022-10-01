const marked = require('marked').marked;

const link = require('./link');
const heading = require('./heading');

const getHeadingParts = require('./getHeadingParts');

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

        return headingTokens
            .map((token) => {
                let parts = getHeadingParts(token.text);
                let spaces = '';
                if (token.depth > 2) {
                    spaces = Array(2 * (token.depth - 2))
                        .fill('  ')
                        .join('');
                }
                return `${spaces}* [${parts.title}](#${parts.id})`;
            })
            .join('\n');
    }
}

module.exports = MarkdownRenderer;

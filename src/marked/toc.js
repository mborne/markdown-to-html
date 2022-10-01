const marked = require('marked').marked;

const getHeadingParts = require('./getHeadingParts');

/**
 * Generate markdown table of content from markdown.
 *
 * @param {string} markdownContent markdown source
 * @returns {string}
 */
function toc(markdownContent) {
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

module.exports = toc;

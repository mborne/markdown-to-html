const marked = require('marked').marked;

/**
 * Extract first h1 title from markdown.
 *
 * @param {string} markdownContent
 */
function title(markdownContent) {
    const lexer = new marked.Lexer();
    let tokens = lexer.lex(markdownContent);
    let h1Tokens = tokens.filter(
        (token) => token.depth == 1 && token.type == 'heading'
    );
    if (h1Tokens.length > 0) {
        return h1Tokens[0].text;
    } else {
        return null;
    }
}

module.exports = title;

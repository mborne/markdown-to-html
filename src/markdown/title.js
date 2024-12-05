import marked from './marked.js';

/**
 * Extract first h1 title from markdown.
 *
 * @param {string} markdownContent
 */
export default function title(markdownContent) {
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

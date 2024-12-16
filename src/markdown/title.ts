import marked from './marked';

/**
 * Extract first h1 title from markdown.
 *
 * @param {string} markdownContent
 */
export default function title(markdownContent: string): string {
    const lexer = new marked.Lexer();
    let tokens = lexer.lex(markdownContent);
    for (const token of tokens) {
        if (token.type !== 'heading') {
            continue;
        }
        if (token.depth == 1) {
            return token.text;
        }
    }
    return null;
}

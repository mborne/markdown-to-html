import { Lexer, type Tokens } from 'marked';

/**
 * Extract first h1 title from markdown.
 */
export default function title(markdownContent: string): string | null {
    const tokens = new Lexer().lex(markdownContent);
    const h1Token = tokens.find(
        (token): token is Tokens.Heading =>
            token.type === 'heading' && token.depth === 1
    );
    return h1Token ? h1Token.text : null;
}

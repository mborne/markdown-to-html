import { Lexer, type Token, type Tokens } from 'marked';

import Slugger from '../helpers/Slugger.js';
import getHeadingParts from './parser/getHeadingParts.js';

/**
 * Generate markdown table of content from markdown.
 */
export default function toc(markdownContent: string): string {
    const tokens = new Lexer().lex(markdownContent);
    const headingTokens = tokens.filter(
        (token): token is Tokens.Heading =>
            token.type === 'heading' && token.depth !== 1
    );

    /*
     * Note that it is important to create a dedicated instance
     * as Slugger counts occurrence of each title.
     */
    const slugger = new Slugger();

    return headingTokens
        .map((headingToken) => {
            // text token for the content
            const token: Token | undefined = headingToken.tokens[0];
            const text =
                token && 'text' in token
                    ? String(token.text)
                    : headingToken.text;
            const raw = token ? token.raw : headingToken.raw;
            const parts = getHeadingParts(text, raw, slugger);

            // indent according to depth
            let spaces = '';
            if (headingToken.depth > 2) {
                spaces = Array(2 * (headingToken.depth - 2))
                    .fill('  ')
                    .join('');
            }
            return `${spaces}* [${parts.title}](#${parts.id})`;
        })
        .join('\n');
}

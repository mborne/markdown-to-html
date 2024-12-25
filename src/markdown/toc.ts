import marked from './marked';

import { slugger } from '../helpers/slugger';
import { getHeadingParts } from './renderer/heading';
import { Tokens } from 'marked';

/**
 * Generate markdown table of content from markdown.
 *
 * @param {string} markdownContent markdown source
 * @returns {string}
 */
export default function toc(markdownContent) {
    const lexer = new marked.Lexer();
    let tokens = lexer.lex(markdownContent);
    let headingTokens: Tokens.Heading[] = tokens.filter(
        (token) => token.type == 'heading' && token.depth != 1
    ) as Tokens.Heading[];

    slugger.reset();

    return headingTokens
        .map((headingToken) => {
            // text token for the content
            //let token = headingToken.tokens[0];
            let parts = getHeadingParts(headingToken);

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

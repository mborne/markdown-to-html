import marked from './marked.js';

import Slugger from '../helpers/Slugger.js';
import getHeadingParts from './parser/getHeadingParts.js';

/**
 * Generate markdown table of content from markdown.
 *
 * @param {string} markdownContent markdown source
 * @returns {string}
 */
export default function toc(markdownContent) {
    const lexer = new marked.Lexer();
    let tokens = lexer.lex(markdownContent);
    let headingTokens = tokens.filter(
        (token) => token.depth != 1 && token.type == 'heading'
    );

    /*
     * Note that it is important to create a dedicated instance
     * as Slugger counts occurrence of each title.
     */
    const slugger = new Slugger();

    return headingTokens
        .map((headingToken) => {
            // text token for the content
            let token = headingToken.tokens[0];
            let parts = getHeadingParts(token.text, token.raw, slugger);

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

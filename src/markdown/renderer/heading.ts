import type { RendererThis, Tokens } from 'marked';

import getHeadingParts from '../parser/getHeadingParts.js';
import slugger from './slugger.js';

/**
 * marked - custom method to render titles.
 *
 * Note that the plain text version of the heading (textRenderer) is used to
 * compute the id, while the rendered inline HTML is used as the title.
 *
 * @private
 */
export default function heading(
    this: RendererThis,
    token: Tokens.Heading
): string {
    const text = this.parser.parseInline(token.tokens);
    const raw = this.parser.parseInline(token.tokens, this.parser.textRenderer);
    const parts = getHeadingParts(text, raw, slugger);

    return `<h${token.depth} id="${parts.id}">${parts.title}</h${token.depth}>`;
}

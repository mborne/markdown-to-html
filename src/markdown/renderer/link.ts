import type { RendererThis, Tokens } from 'marked';

/**
 * marked - custom method to render link with a _blank target for external links.
 *
 * @private
 */
export default function link(this: RendererThis, token: Tokens.Link): string {
    const { href, title } = token;
    const text = this.parser.parseInline(token.tokens);

    /* only external links get a _blank target */
    const target = URL.canParse(href) ? '_blank' : null;

    let out = '<a href="' + href + '"';
    if (title) {
        out += ' title="' + title + '"';
    }
    if (target) {
        out += ' target="' + target + '"';
    }
    out += '>' + text + '</a>';
    return out;
}

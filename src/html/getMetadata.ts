import * as cheerio from 'cheerio';

import type { HtmlLink, HtmlMetadata } from '../types.js';

/**
 * Get title and links from HTML content.
 */
export default function getMetadata(htmlContent: string): HtmlMetadata {
    const $ = cheerio.load(htmlContent);

    const links: HtmlLink[] = [];

    /* extract links */
    const collect = (
        selector: string,
        attribute: string,
        type: 'a' | 'img'
    ) => {
        $(selector).each((_, element) => {
            const targetUrl = $(element).attr(attribute);
            if (targetUrl === undefined) {
                return;
            }
            links.push({ type, targetUrl });
        });
    };
    collect('a', 'href', 'a');
    collect('img', 'src', 'img');

    return {
        /* extract title as first h1 heading */
        title: $('h1').first().html(),
        links,
    };
}

import * as cheerio from 'cheerio';

/**
 * @typedef HtmlLink
 * @property {string} type - The type of the link.
 * @property {string} targetUrl - The URL of the link.
 */

/**
 * @typedef HtmlMetadata
 * @property {string} title - The title of the page.
 * @property {HtmlLink[]} links - An array of link objects with types and target URLs.
 */

/**
 * Get links from HTML content
 *
 * @private
 *
 * @param {string} htmlContent
 * 
 * @returns {HtmlMetadata}
 */
export default function getMetadata(htmlContent) {
    const $ = cheerio.load(htmlContent);

    const metadata = {
        title: null,
        links: [],
    };

    /* extract title as first h1 heading */
    const h1s = $('h1').map((_, element) => {
        return $(element).html();
    });
    if (h1s.length > 0) {
        metadata.title = h1s[0];
    }

    /* extract links */
    $('a').each(function (i, element) {
        metadata.links.push({
            type: 'a',
            targetUrl: $(element).attr('href'),
        });
    });
    $('img').each(function (i, element) {
        metadata.links.push({
            type: 'img',
            targetUrl: $(element).attr('src'),
        });
    });

    return metadata;
}

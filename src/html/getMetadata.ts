import * as cheerio from 'cheerio';

export interface HtmlLink {
    /**
     * The type of the link (a, img,...)
     */
    type: string;
    /**
     * The URL of the link.
     */
    targetUrl: string;
}

export interface HtmlMetadata {
    /**
     * The title of the page.
     */
    title: string;
    /**
     * An array of link objects with types and target URLs.
     */
    links: HtmlLink[];
}

/**
 * Get links from HTML content
 */
export default function getMetadata(htmlContent: string): HtmlMetadata {
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

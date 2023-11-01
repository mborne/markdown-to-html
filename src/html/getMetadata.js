const cheerio = require('cheerio');

/**
 * Get links from HTML content
 *
 * @private
 *
 * @param {string} htmlContent
 */
function getMetadata(htmlContent) {
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

module.exports = getMetadata;

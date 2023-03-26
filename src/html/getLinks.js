const cheerio = require('cheerio');

/**
 * Get links from HTML content
 *
 * @private
 *
 * @param {string} htmlContent
 */
function getLinks(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const links = [];
    $('a').each(function (i, element) {
        links.push({
            type: 'a',
            targetUrl: $(element).attr('href'),
        });
    });
    $('img').each(function (i, element) {
        links.push({
            type: 'img',
            targetUrl: $(element).attr('src'),
        });
    });
    return links;
}

module.exports = getLinks;

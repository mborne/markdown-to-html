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
    $('a').each(function (i, link) {
        links.push({
            text: $(link).text(),
            href: $(link).attr('href'),
        });
    });
    return links;
}

module.exports = getLinks;

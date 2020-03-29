const debug = require('debug')('markdown-to-html');

/**
 * Replace whitespaces by '-'
 * @param {string} text
 */
function slugify(text) {
    var slug = text.toLowerCase().replace(/[^\w]+/g, '-');
    debug(`slugify('${text}') : ${slug}`);
    return slug;
}

module.exports = slugify;

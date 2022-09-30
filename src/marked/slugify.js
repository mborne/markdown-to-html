const marked = require('marked').marked;
const slugger = new marked.Slugger();

/**
 * Convert to lower case and replace whitespaces by '-'
 * @param {string} text
 */
function slugify(text) {
    return slugger.slug(text);
}

module.exports = slugify;

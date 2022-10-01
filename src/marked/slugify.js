const marked = require('marked').marked;

/**
 * Convert to lower case and replace whitespaces by '-'
 *
 * TODO get rid of the function as Slugger (counter consistency for multiple invocation...)
 *
 * @param {string} text
 */
function slugify(text) {
    const slugger = new marked.Slugger();
    return slugger.slug(text);
}

module.exports = slugify;

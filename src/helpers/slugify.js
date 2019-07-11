/**
 * Replace whitespaces by '-'
 * @param {string} text
 */
function slugify(text) {
    var slug = text.toLowerCase().replace(/[^\w]+/g, '-');
    return slug;
}

module.exports = slugify;

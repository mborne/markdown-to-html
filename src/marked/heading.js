const slugify = require('../helpers/slugify');

/**
 * marked - custom method to render titles.
 *
 * @param {string} text
 * @param {string} level
 * @returns {string}
 */
function heading(text, level) {
    var slug = slugify(text);
    return (
        '<h' +
        level +
        ' id="' +
        slug +
        '"><a href="#' +
        slug +
        '" class="anchor"></a>' +
        text +
        '</h' +
        level +
        '>'
    );
}

module.exports = heading;

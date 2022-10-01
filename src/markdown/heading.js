const getHeadingParts = require('./getHeadingParts');

/**
 * marked - custom method to render titles.
 *
 * @private
 *
 * @param {string} text
 * @param {string} level
 * @param {string} raw
 * @param {any} slugger
 *
 * @returns {string}
 */
function heading(text, level, raw, slugger) {
    let parts = getHeadingParts(text, slugger);

    return (
        '<h' +
        level +
        ' id="' +
        parts.id +
        '"><a href="#' +
        parts.id +
        '" class="anchor"></a>' +
        parts.title +
        '</h' +
        level +
        '>'
    );
}

module.exports = heading;
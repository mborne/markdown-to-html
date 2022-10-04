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
    let parts = getHeadingParts(text, raw, slugger);

    return `<h${level} id="${parts.id}">${parts.title}</h${level}>`;
}

module.exports = heading;

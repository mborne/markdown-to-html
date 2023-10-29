const getHeadingParts = require('../parser/getHeadingParts');
const slugger = require('./slugger');

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
function heading(text, level, raw) {
    let parts = getHeadingParts(text, raw, slugger);

    return `<h${level} id="${parts.id}">${parts.title}</h${level}>`;
}

module.exports = heading;

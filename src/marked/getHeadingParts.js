const slugify = require('./slugify');

const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;

/**
 * Get title and id from heading text.
 *
 * Adapted from https://github.com/markedjs/marked-custom-heading-id
 *
 * @param {string} text
 * @return {object}
 */
function getHeadingParts(text) {
    const hasId = text.match(headingIdRegex);
    if (!hasId) {
        return {
            id: slugify(text),
            title: text,
        };
    }
    return {
        id: hasId[1],
        title: text.replace(headingIdRegex, ''),
    };
}

module.exports = getHeadingParts;

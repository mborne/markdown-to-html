const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;

/**
 * Get title and id from heading text.
 *
 * Adapted from https://github.com/markedjs/marked-custom-heading-id
 *
 * @param {string} text
 * @param {string} raw
 * @param {any} slugger
 * @return {object}
 */
function getHeadingParts(text, raw, slugger) {
    const hasId = text.match(headingIdRegex);
    if (!hasId) {
        return {
            id: slugger.slug(raw),
            title: text,
        };
    }
    return {
        id: hasId[1],
        title: text.replace(headingIdRegex, ''),
    };
}

module.exports = getHeadingParts;

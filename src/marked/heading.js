/**
 * marked - custom method to render titles.
 *
 * @param {string} text
 * @param {string} level
 * @returns {string}
 */
function heading(text, level, raw, slugger) {
    // Adapted from https://github.com/markedjs/marked-custom-heading-id
    const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;
    const hasId = text.match(headingIdRegex);
    if (!hasId) {
        let slug = slugger.slug(raw);
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
    } else {
        return (
            '<h' +
            level +
            ' id="' +
            hasId[1] +
            '"><a href="#' +
            hasId[1] +
            '" class="anchor"></a>' +
            text.replace(headingIdRegex, '') +
            '</h' +
            level +
            '>'
        );
    }
}

module.exports = heading;

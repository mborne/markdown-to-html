/**
 * Replace .md by .html
 * @param {string} text
 */
function renameMdToHtml(text) {
    return text.substr(0, text.length - 3) + '.html';
}

module.exports = renameMdToHtml;

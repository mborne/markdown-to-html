/**
 * Replace .phtml by .html
 * @param {string} text
 */
function renameMdToHtml(text) {
    return text.substr(0, text.length - 6) + '.html';
}

module.exports = renameMdToHtml;

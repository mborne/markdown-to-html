/**
 * Escape HTML characters in a string to avoid special chars in headings.
 *
 * @param {string} text
 * @returns {string}
 */
export function escapeTitle(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

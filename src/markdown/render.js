import marked from './marked.js';

/**
 * Render markdown content to HTML.
 *
 * @param {string} markdownContent
 * @returns {string}
 */
export default function render(markdownContent) {
    /* render markdown to html */
    return marked.parse(markdownContent);
}

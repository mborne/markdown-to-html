import marked from './marked.js';

/**
 * Render markdown content to HTML.
 */
export default function render(markdownContent: string): string {
    /* render markdown to html */
    return marked.parse(markdownContent, { async: false });
}

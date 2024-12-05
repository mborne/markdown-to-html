/**
 * Rename rendered extensions (.md, .phtml) to html.
 *
 * @param {string} path
 * @return {string}
 */
export default function renamePathToHtml(path) {
    if (path.endsWith('.md')) {
        return path.slice(0, -3) + '.html';
    } else if (path.endsWith('.phtml')) {
        return path.slice(0, -6) + '.html';
    } else {
        return path;
    }
}

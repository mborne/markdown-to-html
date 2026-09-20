import path from 'node:path';
import renamePathToHtml from './renamePathToHtml.js';

const markdownLinkRegex = /\[([^[\]]*)\]\((.*?)\)/;

/**
 * Split a link target into its path, query string and fragment.
 *
 * Note that URL is not used here as it doesn't handle relative URLs
 * without a base, while query string and fragment must be preserved.
 */
function splitHref(href: string): {
    pathname: string;
    search: string;
    hash: string;
} {
    const parts = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(href);
    return {
        pathname: parts?.[1] ?? href,
        search: parts?.[2] ?? '',
        hash: parts?.[3] ?? '',
    };
}

/**
 * Rewrite relative .md links to .html in markdown text.
 */
export default function rewriteLinksToHtml(text: string): string {
    return text.replace(new RegExp(markdownLinkRegex, 'gm'), function (link) {
        const parts = markdownLinkRegex.exec(link);
        /* istanbul ignore next -- the link matched just above */
        if (parts === null) {
            return link;
        }

        const title = parts[1] ?? '';
        let href = parts[2] ?? '';

        /* external links are kept as is */
        if (!URL.canParse(href)) {
            const { pathname, search, hash } = splitHref(href);
            const ext = path.extname(pathname);
            if (ext === '.md' || ext === '.phtml') {
                href = renamePathToHtml(pathname) + search + hash;
            }
        }
        return `[${title}](${href})`;
    });
}

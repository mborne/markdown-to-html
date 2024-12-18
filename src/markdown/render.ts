import fm from 'front-matter';
import marked from './marked';
import title from './title';
import rewriteLinksToHtml from '../helpers/rewriteLinksToHtml';

/**
 * Render result of the `render` function.
 */
export interface MarkdownRenderResult {
    /**
     * Filtered markdown content as a string (without YAML metadata).
     */
    markdownContent: string;
    /**
     * HTML result as a string (ready to be injected in a layout)
     */
    htmlContent: string;
    /**
     * Title from first h1 title merge with YAML metadata read by front-matter.
     */
    metadata: Map<string, any>;
}

/**
 * Render options for the `render` function.
 */
export interface MarkdownRenderOptions {
    /**
     * Rename relative .md links to .html? Defaults to `false`.
     */
    renameLinksToHtml: boolean;
}

/**
 * Render markdown content to HTML.
 *
 * @param {string} markdownContent
 * @returns {string}
 */
export function render(markdownContent: string, options?: MarkdownRenderOptions): MarkdownRenderResult {
    const renameLinksToHtml = options?.renameLinksToHtml || false;

    // prepare output metadata
    const metadata: Map<string, any> = new Map();

    // read title from markdown
    const markdownTitle = title(markdownContent);
    if (markdownTitle) {
        metadata['title'] = markdownTitle;
    }

    // read metadata from YAML
    const { attributes, body } = fm(markdownContent);

    // filter YAML metadata
    markdownContent = body;

    // copy YAML metadata to output metadata (overwrite title)
    for (const key in attributes as Map<string, string>) {
        metadata[key] = attributes[key];
    }

    // replace .md links by .html links
    if (renameLinksToHtml) {
        markdownContent = rewriteLinksToHtml(markdownContent);
    }

    /* render markdown to html */
    return {
        markdownContent: markdownContent,
        htmlContent: marked.parse(markdownContent) as string,
        metadata: metadata,
    };
}

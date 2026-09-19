import { marked } from 'marked';

import toc from './toc.js';
import slugger from './renderer/slugger.js';
import heading from './renderer/heading.js';
import link from './renderer/link.js';

/**
 * Customize preprocess.
 *
 * @see https://marked.js.org/using_pro#hooks
 */
function preprocess(markdownContent: string): string {
    /* Render table of content */
    markdownContent = markdownContent.replace('[[toc]]', toc(markdownContent));

    /* Reset heading known by slugger */
    slugger.reset();

    return markdownContent;
}

marked.use({ hooks: { preprocess, postprocess: (html) => html } });

/*
 * Customize rendering
 *
 * @see https://marked.js.org/using_pro#renderer
 */
marked.use({ renderer: { heading, link } });

export default marked;

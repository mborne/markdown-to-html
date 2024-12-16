import { marked } from 'marked';

import toc from './toc';

import { slugger } from '../helpers/slugger';

/**
 * Customize preprocess.
 *
 * @param {string} markdownContent
 *
 * @see https://marked.js.org/using_pro#hooks
 *
 * @returns {string}
 */
function preprocess(markdownContent) {
    /* Render table of content */
    markdownContent = markdownContent.replace('[[toc]]', toc(markdownContent));

    /* Reset heading known by slugger */
    slugger.reset();

    return markdownContent;
}

marked.use({ hooks: { preprocess } });

/*
 * Customize rendering
 *
 * @see https://marked.js.org/using_pro#renderer
 */
import heading from './renderer/heading';
import link from './renderer/link';

const renderer = {
    heading: heading,
    link: link,
};

marked.use({ renderer });

export default marked;

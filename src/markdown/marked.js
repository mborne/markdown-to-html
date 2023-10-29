const marked = require('marked').marked;

const toc = require('./toc');
const slugger = require('./renderer/slugger');

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
const renderer = {
    heading: require('./renderer/heading'),
    link: require('./renderer/link'),
};

marked.use({ renderer });

module.exports = marked;

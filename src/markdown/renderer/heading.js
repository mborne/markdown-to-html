import getHeadingParts from '../parser/getHeadingParts.js';
import { slugger } from './slugger.js';

/**
 * marked - custom method to render titles.
 *
 * @private
 *
 * @param {string} text
 * @param {string} level
 * @param {string} raw
 * @param {any} slugger
 *
 * @returns {string}
 */
export default function heading(text, level, raw) {
    let parts = getHeadingParts(text, raw, slugger);

    return `<h${level} id="${parts.id}">${parts.title}</h${level}>`;
}

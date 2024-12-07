import { escapeTitle } from '../../helpers/html.js';
import getHeadingParts from '../parser/getHeadingParts.js';
import { slugger } from '../../helpers/slugger.js';

/**
 * marked - custom method to render titles.
 *
 * @private
 */
export default function heading({ text, raw, depth }) {
    const parts = getHeadingParts(text, raw, slugger);
    const title = escapeTitle(parts.title);
    return `<h${depth} id="${parts.id}">${title}</h${depth}>`;
}

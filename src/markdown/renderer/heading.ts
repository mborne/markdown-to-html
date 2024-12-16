import { escapeTitle } from '../../helpers/html';
import getHeadingParts from '../parser/getHeadingParts';
import { slugger } from '../../helpers/slugger';

/**
 * marked - custom method to render titles.
 */
export default function heading({ text, raw, depth }) {
    const parts = getHeadingParts(text, raw, slugger);
    const title = escapeTitle(parts.title);
    return `<h${depth} id="${parts.id}">${title}</h${depth}>`;
}

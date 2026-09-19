import type Slugger from '../../helpers/Slugger.js';
import type { HeadingParts } from '../../types.js';

const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;

/**
 * Get title and id from heading text.
 *
 * Adapted from https://github.com/markedjs/marked-custom-heading-id
 */
export default function getHeadingParts(
    text: string,
    raw: string,
    slugger: Slugger
): HeadingParts {
    const hasId = headingIdRegex.exec(text);
    if (!hasId) {
        return {
            id: slugger.slug(raw),
            title: text,
        };
    }
    return {
        id: hasId[1] ?? '',
        title: text.replace(headingIdRegex, ''),
    };
}

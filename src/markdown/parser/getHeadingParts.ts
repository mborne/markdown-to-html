import { Slugger } from '../../helpers/slugger';

const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;

/**
 * Get title and id from heading text.
 *
 * Adapted from https://github.com/markedjs/marked-custom-heading-id
 */
export default function getHeadingParts(text: string, raw: string, slugger: Slugger) {
    const hasId = text.match(headingIdRegex);
    if (!hasId) {
        return {
            id: slugger.slug(text),
            title: text,
        };
    }
    return {
        id: hasId[1],
        title: text.replace(headingIdRegex, ''),
    };
}

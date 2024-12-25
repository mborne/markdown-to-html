import { slugger } from '../../helpers/slugger';
import { Parser, Tokens } from 'marked';

const headingIdRegex = /(?: +|^)\{#([a-z][\w-]*)\}(?: +|$)/i;

const headingParser = new Parser();

interface HeadingParts {
    id: string;
    title: string;
}

/**
 * Get id and title for syntax "## [A title](#custom-id)"
 */
function getHeadingPartsFromLink({ text, href }: Tokens.Link): HeadingParts {
    return {
        id: href.startsWith('#') ? href.slice(1) : slugger.slug(text),
        title: text,
    };
}

/**
 * Get title and id from heading token.
 *
 * Adapted from https://github.com/markedjs/marked-custom-heading-id
 */
export function getHeadingParts({ text, tokens, depth }: Tokens.Heading): HeadingParts {
    if (tokens[0].type == 'link') {
        return getHeadingPartsFromLink(tokens[0] as Tokens.Link);
    }

    const hasId = text.match(headingIdRegex);
    if (!hasId) {
        return {
            id: slugger.slug(text),
            title: text,
        };
    }

    const textWithoutId = text.replace(headingIdRegex, '');
    return {
        id: hasId[1],
        title: textWithoutId,
    };
}

/**
 * marked - custom method to render titles.
 */
export default function heading(token: Tokens.Heading) {
    const depth = token.depth;
    const parts = getHeadingParts(token);
    return `<h${depth} id="${parts.id}">${parts.title}</h${depth}>`;
}

/**
 * Severity of an error reported by the Checker.
 */
export const ErrorLevel = Object.freeze({
    INFO: 'INFO',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
} as const);

export type ErrorLevel = (typeof ErrorLevel)[keyof typeof ErrorLevel];

/**
 * Kind of error reported by the Checker.
 */
export const ErrorCode = Object.freeze({
    DEAD_LINK: 'DEAD_LINK',
} as const);

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/**
 * An error reported by the Checker.
 */
export interface CheckError {
    level: ErrorLevel;
    code: ErrorCode;
    message: string;
}

/**
 * A link found in an HTML content.
 */
export interface HtmlLink {
    type: 'a' | 'img';
    targetUrl: string;
}

/**
 * Metadata extracted from an HTML content.
 */
export interface HtmlMetadata {
    title: string | null;
    links: HtmlLink[];
}

/**
 * The id and the title of a markdown heading.
 */
export interface HeadingParts {
    id: string;
    title: string;
}

/**
 * Options shared by the CLI commands and the Renderer.
 */
export interface RenderOptions {
    /** convert .md or .phtml links to .html */
    renameLinksToHtml?: boolean;
    /** language for HTML pages, defaulted to "en" */
    language?: string;
}

/**
 * The context given to the handlebars template of a Layout.
 *
 * Note that the index signature is required as YAML front-matter
 * adds arbitrary keys to the context.
 */
export interface RenderContext {
    /** root directory of the SourceDir (required by the handlebars helpers) */
    rootDir: string;
    /** absolute path to the rendered file (required by the handlebars helpers) */
    path: string;
    /** path of the rendered file relative to rootDir */
    relativePath: string;
    title: string;
    lang: string;
    content?: string;
    markdownContent?: string;
    [key: string]: unknown;
}

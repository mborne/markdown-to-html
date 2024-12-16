/**
 * Types of files in a {@link SourceDir}
 */
declare enum FileType {
    DIRECTORY = "directory",
    MARKDOWN = "md",
    PHTML = "phtml",
    STATIC = "static"
}
/**
 * Represents a file in a {@link SourceDir}.
 *
 * @typedef SourceFile
 * @type {object}
 * @property {FileType} type - type of the file
 * @property {string} path - absolute path to the file
 * @property {string} relativePath - path relative  to the root dir
 */
declare class SourceFile {
    readonly sourceDir: SourceDir;
    readonly absolutePath: string;
    /**
     * The type of the file
     */
    readonly type: FileType;
    /**
     * The path of the file relative to the root directory
     */
    readonly relativePath: string;
    /**
     * @param {SourceDir} sourceDir the source directory
     * @param {string} absolutePath the absolute path of the file
     */
    constructor(sourceDir: SourceDir, absolutePath: string);
    /**
     * Get content for the given file.
     */
    getContentRaw(): string;
}

/**
 * Represents a root directory containing markdown
 * and static files.
 */
declare class SourceDir {
    /**
     * The directory containing sources
     */
    readonly rootDir: string;
    /**
     * Filter files
     */
    private filter;
    constructor(rootDir: string);
    /**
     * Get relative path for a given file.
     */
    getRelativePath(absolutePath: string): string;
    /**
     * Find files in root directory
     */
    findFiles(): SourceFile[];
    /**
     * Locate file in rootDir according to relativePath
     */
    locateFile(relativePath: string): SourceFile | null;
    /**
     * Locate file rendered to html in order to find .md or .phtml files
     * using .html in URLs.
     *
     * @private
     */
    locateRenderedFile(relativePath: string): SourceFile | null;
    /**
     * Locate index files
     * @param {SourceFile} sourceFile a directory
     * @return {SourceFile}
     */
    locateIndex(sourceFile: SourceFile): SourceFile | null;
}

declare enum ErrorLevel {
    INFO = "INFO",
    WARNING = "WARNING",
    ERROR = "ERROR"
}
declare enum ErrorCode {
    DEAD_LINK = "DEAD_LINK"
}
interface CheckerOptions {
    /**
     * Perform external link checks using HTTP requests? Default is false.
     */
    checkExternalLinks: boolean;
}
interface CheckerError {
    level: ErrorLevel;
    code: ErrorCode;
    message: string;
}
/**
 * Helper class to check files in a source directory
 */
declare class Checker {
    readonly checkExternalLinks: boolean;
    /**
     * @param {object} options
     * @param {boolean} options.checkExternalLinks
     */
    constructor(options: CheckerOptions);
    /**
     * Check all files in a source directory
     */
    checkSourceDir(sourceDir: SourceDir): Promise<CheckerError[]>;
    /**
     * Check a source file
     */
    checkSourceFile(sourceFile: SourceFile): Promise<CheckerError[]>;
    /**
     * Check links from sourceFile
     *
     * @param {SourceFile} sourceFile
     * @param {object} link
     * @return {Promise<object|null>}
     */
    checkLink(sourceFile: SourceFile, link: any): Promise<CheckerError>;
    /**
     * Check targetUrl performing a GET request.
     */
    checkExternalLink(sourceFile: SourceFile, targetUrl: string): Promise<CheckerError | null>;
    /**
     * Check internal link ensuring the target file exists.
     */
    checkInternalLink(sourceFile: SourceFile, targetUrl: string): CheckerError | null;
}

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
declare class Layout {
    /**
     * @property {string} layoutPath path to the directory containing page.html
     */
    private layoutPath;
    /**
     * @property {string} templatePath path to the page.html template file
     */
    private templatePath;
    /**
     * @property {string} assetsPath path to the assets directory
     */
    private assetsPath;
    /**
     * @param {string} layoutPath path to the directory containing page.html
     */
    constructor(layoutPath: any);
    /**
     * @returns the path of the layout directory.
     */
    getPath(): string;
    /**
     * Check if the assets directory exists.
     */
    hasAssets(): boolean;
    /**
     * Get handlebar's template.
     */
    getTemplate(): HandlebarsTemplateDelegate;
}

interface RendererOptions {
    /**
     * Convert .md or .phtml links to .html?
     */
    renameLinksToHtml?: boolean;
    /**
     * Language for HTML pages defaulted to "en"
     */
    language?: string;
}
/**
 * Helper class to render markdown files in a directory
 */
declare class Renderer {
    private sourceDir;
    private layout;
    private renameLinksToHtml;
    private language;
    private template;
    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {boolean} [options.renameLinksToHtml=false] convert .md or .phtml links to .html
     * @param {string} [options.language='en'] language for HTML pages defaulted to "en"
     */
    constructor(sourceDir: SourceDir, layout: Layout, options?: RendererOptions);
    /**
     * Render a source file into a string. Supported file types are Markdown and HTML views.
     * @param {SourceFile} sourceFile - The source file to render.
     */
    render(sourceFile: SourceFile): string;
}

/**
 * Test if a file is ignored (allows to ignore some directories like .git, node_modules,...)
 */
declare class SourceDirFilter {
    /**
     * Regexps that match the ignored files.
     */
    private ignoredList;
    constructor();
    /**
     * Test if a file is ignored
     *
     * @param {string} relativePath
     *
     * @returns {boolean}
     */
    isIgnored(relativePath: string): boolean;
}

/**
 * An helper script to detect dead links in .md or .phtml files.
 * @param sourceDirPath path to the directory containing .md or .phtml files.
 * @param options checker options.
 */
declare function check(sourceDirPath: string, options: CheckerOptions): Promise<void>;

/**
 * Options for the convert process.
 */
interface ConvertOptions {
    /**
     * Language for HTML pages defaulted to "en"
     */
    language: string;
    /**
     * Force overwrite existing output dir if it exists?
     */
    force?: boolean;
}
/**
 * Convert MD files in rootDir to outputDir
 *
 * @param sourceDirPath path to source directory
 * @param outputDirPath path to output directory
 * @param layoutPath path to layout directory
 * @param options
 */
declare function convert(sourceDirPath: string, outputDirPath: string, layoutPath: string, options: ConvertOptions): void;

interface ServeOptions {
    /**
     * language for HTML pages defaulted to "en"
     */
    language?: string;
}
/**
 * Serve MD files from rootDir
 * @param {String} sourceDirPath path to source directory
 * @param {String} layoutPath path to layout directory
 * @param {ServeOptions} options
 */
declare function serve(sourceDirPath: string, layoutPath: string, options: ServeOptions): void;

export { Checker, type CheckerOptions, ErrorCode, ErrorLevel, FileType, Layout, Renderer, type RendererOptions, SourceDir, SourceDirFilter, SourceFile, check, convert, serve };

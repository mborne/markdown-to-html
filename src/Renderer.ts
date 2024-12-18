import { logger } from './logger';

import path from 'path';

import { SourceDir } from './SourceDir';
import { SourceFile, FileType } from './SourceFile';
import { Layout } from './Layout';
import { render } from './markdown/render';
import getMetadata from './html/getMetadata';

export interface RendererOptions {
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
 * Helper class to render markdown files from a directory with an HTML layout.
 */
export class Renderer {
    private sourceDir: SourceDir;
    private layout: Layout;
    private renameLinksToHtml: boolean;
    private language: string;
    private template: HandlebarsTemplateDelegate;

    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {boolean} [options.renameLinksToHtml=false] convert .md or .phtml links to .html
     * @param {string} [options.language='en'] language for HTML pages defaulted to "en"
     */
    constructor(sourceDir: SourceDir, layout: Layout, options: RendererOptions = {}) {
        this.sourceDir = sourceDir;
        this.layout = layout;
        this.renameLinksToHtml = options.renameLinksToHtml ?? false;
        this.language = options.language ?? 'en';
        this.template = this.layout.getTemplate();
    }

    /**
     * Render a source file into a string. Supported file types are Markdown and HTML views.
     * @param {SourceFile} sourceFile - The source file to render.
     */
    render(sourceFile: SourceFile): string {
        logger.info(`[Renderer] render('${sourceFile.relativePath}')...`);
        if (![FileType.MARKDOWN, FileType.PHTML].includes(sourceFile.type)) {
            throw new Error(`Unsupported file type: ${sourceFile.type}`);
        }

        /*
         * Prepare rendering context with default metadata
         * TODO : Add interface for HandlebarContext for better type checking.
         */
        const context = {
            // handlebars helpers requirements
            rootDir: this.sourceDir.rootDir,
            path: sourceFile.absolutePath,

            // in order to allow to produce edit link in custom template
            relativePath: sourceFile.relativePath.replaceAll('\\', '/'),

            // common HTML metadata
            title: path.relative(this.sourceDir.rootDir, sourceFile.absolutePath),
            lang: this.language,

            // rendered content will be written to this field
            content: null,
            // markdown content will be saved into this field (for RemarkJS)
            markdownContent: null,
        };

        if (FileType.MARKDOWN == sourceFile.type) {
            // render markdown
            const result = render(sourceFile.getContentRaw(), {
                renameLinksToHtml: this.renameLinksToHtml,
            });
            context.content = result.htmlContent;
            // output markdown source (for layout like remarkjs layout)
            context.markdownContent = result.markdownContent;
            // output markdown attributes
            for (const key in result.metadata) {
                context[key] = result.metadata[key];
            }
        } else {
            if (sourceFile.type == FileType.PHTML) {
                const { title } = getMetadata(sourceFile.getContentRaw());
                if (title) {
                    context.title = title;
                }
            }
            // output raw content
            context.content = sourceFile.getContentRaw();
        }

        /* return full html */
        return this.template(context);
    }
}

import { logger } from './logger.js';

import path from 'path';

import fm from 'front-matter';

import { SourceDir } from './SourceDir.js';
import { SourceFile, FileType } from './SourceFile.js';
import { Layout } from './Layout.js';
import render from './markdown/render.js';
import title from './markdown/title.js';
import rewriteLinksToHtml from './helpers/rewriteLinksToHtml.js';
import getMetadata from './html/getMetadata.js';

/**
 * Helper class to render markdown files in a directory
 */
export class Renderer {
    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {boolean} [options.renameLinksToHtml=false] convert .md or .phtml links to .html
     * @param {string} [options.language='en'] language for HTML pages defaulted to "en"
     */
    constructor(sourceDir, layout, options = {}) {
        this.sourceDir = sourceDir;
        this.layout = layout;
        this.renameLinksToHtml = options.renameLinksToHtml ?? false;
        this.language = options.language ?? 'en';
        this.template = this.layout.getTemplate();
    }

    /**
     * Render a given file
     * @param {SourceFile} sourceFile
     */
    render(sourceFile) {
        logger.info(`[Renderer] render('${sourceFile.relativePath}')...`);
        if (![FileType.MARKDOWN, FileType.PHTML].includes(sourceFile.type)) {
            throw new Error(`Unsupported file type: ${sourceFile.type}`);
        }

        /*
         * Prepare rendering context with default metadata
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
        };

        if (FileType.MARKDOWN == sourceFile.type) {
            // read title from markdown
            const markdownTitle = title(sourceFile.getContentRaw());
            if (markdownTitle) {
                context.title = markdownTitle;
            }

            // read metadata from YAML
            const { attributes, body } = fm(sourceFile.getContentRaw());
            let markdownContent = body;
            for (const key in attributes) {
                context[key] = attributes[key];
            }

            // replace .md links by .html links
            if (this.renameLinksToHtml) {
                markdownContent = rewriteLinksToHtml(markdownContent);
            }

            // render markdown
            context.content = render(markdownContent);
            // output markdown source (for layout like remarkjs layout)
            context.markdownContent = markdownContent;
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

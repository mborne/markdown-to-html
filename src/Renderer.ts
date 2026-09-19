import createDebug from 'debug';
import path from 'node:path';
import fmDefault from 'front-matter';
import type { FrontMatterResult } from 'front-matter';

import FileType from './FileType.js';
import * as markdown from './markdown/index.js';
import rewriteLinksToHtml from './helpers/rewriteLinksToHtml.js';
import getMetadata from './html/getMetadata.js';

import type SourceDir from './SourceDir.js';
import type SourceFile from './SourceFile.js';
import type Layout from './Layout.js';
import type { RenderContext, RenderOptions } from './types.js';

const debug = createDebug('markdown-to-html');

/*
 * front-matter is a CommonJS module shipping an ESM style declaration file,
 * so its default import has to be re-typed to match the actual runtime value.
 */
const fm = fmDefault as unknown as <T>(file: string) => FrontMatterResult<T>;

/**
 * Helper class to render markdown files in a directory
 */
export default class Renderer {
    private readonly renameLinksToHtml: boolean;
    private readonly language: string;
    private readonly template: HandlebarsTemplateDelegate<RenderContext>;

    constructor(
        private readonly sourceDir: SourceDir,
        private readonly layout: Layout,
        options: RenderOptions = {}
    ) {
        this.renameLinksToHtml = options.renameLinksToHtml ?? false;
        this.language = options.language ?? 'en';
        this.template = this.layout.getTemplate();
    }

    /**
     * Render a given file
     */
    render(sourceFile: SourceFile): string {
        debug(`render('${JSON.stringify(sourceFile)}')...`);

        /*
         * Prepare rendering context with default metadata
         */
        const context: RenderContext = {
            // handlebars helpers requirements
            rootDir: this.sourceDir.rootDir,
            path: sourceFile.absolutePath,

            // in order to allow to produce edit link in custom template
            relativePath: sourceFile.relativePath,

            // common HTML metadata
            title: path.relative(
                this.sourceDir.rootDir,
                sourceFile.absolutePath
            ),
            lang: this.language,
        };

        if (FileType.MARKDOWN === sourceFile.type) {
            // read title from markdown
            const markdownTitle = markdown.title(sourceFile.getContentRaw());
            if (markdownTitle) {
                context.title = markdownTitle;
            }

            // read metadata from YAML
            const { attributes, body } = fm<Record<string, unknown>>(
                sourceFile.getContentRaw()
            );
            let markdownContent = body;
            for (const [key, value] of Object.entries(attributes)) {
                context[key] = value;
            }

            // replace .md links by .html links
            if (this.renameLinksToHtml) {
                markdownContent = rewriteLinksToHtml(markdownContent);
            }

            // render markdown
            context.content = markdown.render(markdownContent);
            // output markdown source (for layout like remarkjs layout)
            context.markdownContent = markdownContent;
        } else {
            if (sourceFile.type === FileType.PHTML) {
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

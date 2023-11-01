const debug = require('debug')('markdown-to-html');

const SourceDir = require('./SourceDir');

const path = require('path');

const SourceFile = require('./SourceFile');
const FileType = require('./FileType');
const Layout = require('./Layout');

const markdown = require('./markdown');
const fm = require('front-matter');
const rewriteLinksToHtml = require('./helpers/rewriteLinksToHtml');
const getMetadata = require('./html/getMetadata');

/**
 * Helper class to render markdown files in a directory
 */
class Renderer {
    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {boolean} options.renameLinksToHtml convert .md or .phtml links to .html
     * @param {string} options.language language for HTML pages defaulted to "en"
     */
    constructor(sourceDir, layout, options) {
        this.sourceDir = sourceDir;
        this.layout = layout;
        this.renameLinksToHtml = options.renameLinksToHtml || false;
        this.language = options.language || 'en';
        this.template = this.layout.getTemplate();
    }

    /**
     * Render a given file
     * @param {SourceFile} sourceFile
     */
    render(sourceFile) {
        debug(`render('${JSON.stringify(sourceFile)}')...`);

        /*
         * Prepare rendering context with default metadata
         */
        const context = {
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

        if (FileType.MARKDOWN == sourceFile.type) {
            // read title from markdown
            const markdownTitle = markdown.title(sourceFile.getContentRaw());
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
            context.content = markdown.render(markdownContent);
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

module.exports = Renderer;

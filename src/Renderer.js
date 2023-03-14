const debug = require('debug')('markdown-to-html');

const SourceDir = require('./SourceDir');

const fs = require('fs');
const path = require('path');

const RendererMode = require('./RendererMode');
const SourceFile = require('./SourceFile');
const FileType = require('./FileType');
const Layout = require('./Layout');

const handlebars = require('handlebars');
handlebars.registerHelper('asset', require('./handlebars/asset'));

const markdown = require('./markdown');
const rewriteLinksToHtml = require('./helpers/rewriteLinksToHtml');

/**
 * Helper class to render markdown files in a directory
 */
class Renderer {
    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {RendererMode} options.mode convert or serve
     */
    constructor(sourceDir, layout, options) {
        this.sourceDir = sourceDir;
        this.layout = layout;
        this.renameMarkdownLinksToHtml = options.mode == RendererMode.CONVERT;
    }

    /**
     * Render a given file
     * @param {SourceFile} sourceFile
     */
    render(sourceFile) {
        debug(`render('${JSON.stringify(sourceFile)}')...`);

        let content = null;
        let markdownContent = null;
        if (FileType.MARKDOWN == sourceFile.type) {
            markdownContent = fs.readFileSync(sourceFile.absolutePath, 'utf8');
            // replace .md links by .html links
            if (this.renameMarkdownLinksToHtml) {
                markdownContent = rewriteLinksToHtml(markdownContent);
            }
            content = markdown.render(markdownContent);
        } else {
            content = fs.readFileSync(sourceFile.absolutePath, 'utf-8');
        }

        /* inject html content in a template */
        const templateSource = fs.readFileSync(
            this.layout.path + '/page.html',
            'utf8'
        );
        const template = handlebars.compile(templateSource);

        /**
         * Create render context for handlebars
         */
        const context = {
            title: path.relative(
                this.sourceDir.rootDir,
                sourceFile.absolutePath
            ),
            content: content,
            markdownContent: markdownContent,
            rootDir: this.sourceDir.rootDir,
            path: sourceFile.absolutePath,
        };

        /* return full html */
        return template(context);
    }
}

module.exports = Renderer;

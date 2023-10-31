const debug = require('debug')('markdown-to-html');

const SourceDir = require('./SourceDir');

const path = require('path');

const SourceFile = require('./SourceFile');
const FileType = require('./FileType');
const Layout = require('./Layout');

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
     * @param {boolean} options.renameLinksToHtml convert .md or .phtml links to .html
     */
    constructor(sourceDir, layout, options) {
        this.sourceDir = sourceDir;
        this.layout = layout;
        this.renameLinksToHtml = options.renameLinksToHtml || false;
        this.template = this.layout.getTemplate();
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
            markdownContent = sourceFile.getContentRaw();
            // replace .md links by .html links
            if (this.renameLinksToHtml) {
                markdownContent = rewriteLinksToHtml(markdownContent);
            }
            content = markdown.render(markdownContent);
        } else {
            content = sourceFile.getContentRaw();
        }

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
        return this.template(context);
    }
}

module.exports = Renderer;

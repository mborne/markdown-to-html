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

const MarkdownRenderer = require('./marked/MarkdownRenderer');

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

        this.markdownRenderer = new MarkdownRenderer({
            renameMarkdownLinksToHtml: options.mode == RendererMode.CONVERT,
        });
    }

    /**
     * Render a given file
     * @param {SourceFile} sourceFile
     */
    render(sourceFile) {
        debug(`render('${JSON.stringify(sourceFile)}')...`);

        /* render source to html */
        let content =
            sourceFile.type == FileType.MARKDOWN
                ? this.renderMarkdownContent(sourceFile.absolutePath)
                : this.renderHtmlViewContent(sourceFile.absolutePath);

        /* inject html content in a template */
        var templateSource = fs.readFileSync(
            this.layout.path + '/page.html',
            'utf8'
        );
        var template = handlebars.compile(templateSource);

        var context = {
            title: path.relative(
                this.sourceDir.rootDir,
                sourceFile.absolutePath
            ),
            content: content,
            rootDir: this.sourceDir.rootDir,
            path: sourceFile.absolutePath,
        };
        /* return full html */
        return template(context);
    }

    /**
     * Convert markdown to HTML
     *
     * @private
     *
     * @param {string} absolutePath
     * @returns {string}
     */
    renderMarkdownContent(absolutePath) {
        debug(`renderMarkdownContent('${absolutePath}')...`);
        /* read markdown source and render table of content */
        let markdownContent = fs.readFileSync(absolutePath, 'utf8');
        return this.markdownRenderer.render(markdownContent);
    }

    /**
     * Load HTML view content
     *
     * @private
     *
     * @param {string} absolutePath
     * @returns {string}
     */
    renderHtmlViewContent(absolutePath) {
        debug(`renderMarkdownContent('${absolutePath}')...`);
        return fs.readFileSync(absolutePath, 'utf-8');
    }
}

module.exports = Renderer;
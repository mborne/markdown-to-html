const debug = require('debug')('markdown-to-html');

const SourceDir = require('./SourceDir');

const fs = require('fs');
const path = require('path');
const url = require('url');

const SourceFile = require('./SourceFile');
const FileType = require('./FileType');
const Layout = require('./Layout');

const handlebars = require('handlebars');
handlebars.registerHelper('asset', require('./handlebars/asset'));

const toc = require('markdown-toc');
const heading = require('./marked/heading');
const marked = require('marked');
const slugify = require('./helpers/slugify');
const renameMdToHtml = require('./helpers/renameMdToHtml');

/**
 * Helper class to render markdown files in a directory
 */
class Renderer {
    /**
     * @param {SourceDir} sourceDir
     * @param {Layout} layout
     *
     * @param {Object} options
     * @param {string} options.mode convert or serve
     */
    constructor(sourceDir, layout, options) {
        this.mode = options.mode;
        this.sourceDir = sourceDir;
        this.layout = layout;
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
        markdownContent = markdownContent.replace(
            '[[toc]]',
            this.renderToc(markdownContent)
        );

        /* Create marked renderer */
        var renderer = new marked.Renderer();

        /* Customize heading renderer */
        renderer.heading = heading;

        /* Customize link renderer */
        renderer.link = function (href, title, text) {
            var parsed = url.parse(href);

            /* convert .md links to .html for non external links */
            var target = null;
            if (!parsed.protocol) {
                var ext = path.extname(parsed.pathname || '');
                if (this.mode == 'convert' && ext === '.md') {
                    parsed.pathname = renameMdToHtml(parsed.pathname);
                    href = url.format(parsed);
                }
            } else {
                target = '_blank';
            }

            var out = '<a href="' + href + '"';
            if (title) {
                out += ' title="' + title + '"';
            }
            if (target) {
                out += ' target="' + target + '"';
            }
            out += '>' + text + '</a>';
            return out;
        }.bind(this);

        /* render markdown */
        var content = marked(markdownContent, {
            renderer: renderer,
        });
        return content;
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

    /**
     * Render TOC according to markdown
     *
     * @private
     *
     * @param {string} markdownContent markdown source
     */
    renderToc(markdownContent) {
        return toc(markdownContent, {
            /* ignore h1 titles */
            firsth1: false,
            /* ensure consistency with title */
            slugify: slugify,
        }).content;
    }
}

module.exports = Renderer;

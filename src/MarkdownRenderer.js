const fs = require('fs');
const path = require('path');
const url = require('url');

const relative = require('path').relative;
const toc = require('markdown-toc');
const marked = require('marked');

const handlebars = require('handlebars');
handlebars.registerHelper('asset', require('./handlebars/asset'));

const slugify = require('./helpers/slugify');
const renameMdToHtml = require('./helpers/renameMdToHtml');

/**
 * Helper class to render markdown files in a directory
 */
class MarkdownRenderer {

    /**
     * @param {string} rootDir 
     * @param {string} layoutPath path to the template layout 
     */
    constructor(rootDir, layoutPath) {
        this.rootDir = rootDir;
        this.layoutPath = layoutPath;
    }

    /**
     * Render a given file
     * @param {string} inputPath 
     * @param {Object} options 
     */
    renderFile(inputPath, options) {
        /* read source and render toc based on markdown content */
        var text = fs.readFileSync(inputPath, 'utf8'),
            text = text.replace('[[toc]]', this.renderToc(text))
        ;

        var renderer = new marked.Renderer();

        /* Customize heading renderer */
        renderer.heading = function (text, level) {
            var slug = slugify(text);
            return "<h" + level + " id=\"" + slug + "\"><a href=\"#" + slug + "\" class=\"anchor\"></a>" + text + "</h" + level + ">";
        };

        /* Customize link renderer */
        renderer.link = function(href, title, text){
            var parsed = url.parse(href);

            /* convert .md links to .html for non external links */
            var target = null;
            if (!parsed.protocol) {
                var ext = path.extname(parsed.pathname || '');
                if (ext === '.md') {
                    if ( parsed.pathname.endsWith('.md') ){
                        parsed.pathname = renameMdToHtml(parsed.pathname);
                    }
                    href = url.format(parsed);
                }
            }else{
                target = "_blank";
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
        }

        /* render markdown */
        var content = marked(text, {
            renderer: renderer
        });

        /* inject result in a template */
        handlebars.registerPartial('content', content);
        var templateSource = fs.readFileSync(this.layoutPath + '/page.html', "utf8");
        var template = handlebars.compile(templateSource);

        var context = {
            title: relative(this.rootDir, inputPath),
            content: content,
            rootDir: this.rootDir,
            path: inputPath
        }
        /* return full html */
        return template(context);
    }

    /**
     * Render TOC according to markdown
     * @param {string} text markdown source
     */
    renderToc(text) {
        return toc(text, {
            /* ignore h1 titles */
            firsth1: false,
            /* ensure consistency with title */
            slugify: slugify
        }).content;
    }

}


module.exports = MarkdownRenderer;

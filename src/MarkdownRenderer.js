const fs = require('fs');
const relative = require('path').relative;
const toc = require('markdown-toc');
const marked = require('marked');

const handlebars = require('handlebars');
handlebars.registerHelper('asset', require('./helpers/asset'));

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
     * @param {string} path 
     * @param {Object} options 
     */
    renderFile(path, options) {
        /* read source and render toc based on markdown content */
        var text = fs.readFileSync(path, 'utf8'),
            text = text.replace('[[toc]]', this.renderToc(text))
            ;

        var renderer = new marked.Renderer();
        renderer.heading = function (text, level) {
            var slug = text.toLowerCase().replace(/[^\w]+/g, '-');
//          toc.push({
//              level: level,
//              slug: slug,
//              title: text
//          });
            return "<h" + level + " id=\"" + slug + "\"><a href=\"#" + slug + "\" class=\"anchor\"></a>" + text + "</h" + level + ">";
        };

        /* render markdown */
        var content = marked(text, {
            renderer: renderer
        });

        /* inject result in a template */
        handlebars.registerPartial('content', content);
        var templateSource = fs.readFileSync(this.layoutPath + '/page.html', "utf8");
        var template = handlebars.compile(templateSource);

        var context = {
            title: relative(this.rootDir, path),
            content: content,
            rootDir: this.rootDir,
            path: path
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
            firsth1: false,
            slugify: function (text) {
                return text
                    .replace(/[^\w]+/g, '-')
                    .toLowerCase();
                ;
            }
        }).content;
    }
}


module.exports = MarkdownRenderer;

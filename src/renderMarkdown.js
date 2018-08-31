const fs  = require('fs');
const toc = require('markdown-toc');

/* create converter */
var showdown    = require('showdown'),
    converter   = new showdown.Converter({
        simplifiedAutoLink: true,
        tables: true,
        ghCompatibleHeaderId: false
    })
;

function renderMarkdown(source, options){
    /* on laisse pandoc générer la toc */
    var text        = fs.readFileSync(source,'utf8'),
        text        = text.replace('[[toc]]',toc(text,{
            firsth1: true,
            //stripHeadingTags: false,
            slugify: function(text){
                // voir showdown subparser/headers, cas options.ghCompatibleHeaderId
                return text
                    .replace(/[^\w]/g, '')
                    .toLowerCase();
                ;
            }
        }).content)
    ;
    return converter.makeHtml(text);
}

module.exports = renderMarkdown;

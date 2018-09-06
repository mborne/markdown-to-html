const express = require('express');

const MarkdownRenderer = require('../MarkdownRenderer');
const checkRootDir = require('./checks/checkRootDir');
const checkLayoutPath = require('./checks/checkLayoutPath');

const locateFile = require('../helpers/locateFile');

/**
 * Convert MD files in rootDir to outputDir
 * @param {Object} options
 * @param {String} options.rootDir path to source directory
 * @param {String} options.outputDir path to output directory
 * @param {String} options.layoutPath path to layout directory
 */
function serve(options) {
    /* root directory */
    const rootDir = options.rootDir;
    checkRootDir(rootDir);

    /* template path */
    const layoutPath = options.layoutPath;
    checkLayoutPath(layoutPath);

    /* Create renderer */
    var markdownRenderer = new MarkdownRenderer(
        rootDir,
        layoutPath
    );
    
    const app = express();

    app.use('/assets',express.static(layoutPath+'/assets'));

    app.get(/^\/(.*)/, function(req, res) {
        var href = req.params[0];
        var file = locateFile(rootDir,href);
        if ( file != null ){
            // TODO handle file types
            res.send(markdownRenderer.renderFile(file));
        }else{
            res.status(404).send("Not found");
        }
    });

    app.listen(3000, function () {
        console.log('Example app listening on port 3000!');
    });
}

module.exports = serve;

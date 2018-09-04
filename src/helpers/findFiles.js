const isIgnored = require('./isIgnored');
const shell = require('shelljs');
const fs = require('fs');
const path = require('path');

/**
 * Find files in root directory
 */
function findFiles(rootDir){
    var result = [];

    shell.find(rootDir).forEach(function (inputFile) {
        var relativePath = path.relative(rootDir, inputFile);
        if (isIgnored(relativePath))
            return;

        if (fs.lstatSync(inputFile).isDirectory()) {
            result.push({
                type: 'directory',
                path: inputFile,
                relativePath: relativePath,
                outputRelativePath: relativePath
            });
        } else if (relativePath.match(/\.md$/)) {
            var outputRelativePath = relativePath.substr(relativePath, relativePath.length - 3) + '.html';
            result.push({
                type: 'md',
                path: inputFile,
                relativePath: relativePath,
                outputRelativePath: outputRelativePath
            });
        } else {
            result.push({
                type: 'static',
                path: inputFile,
                relativePath: relativePath,
                outputRelativePath: relativePath
            });
        }
    });

    return result;
}

module.exports = findFiles;


const fs = require('fs');

/**
 * Check rootDir option ensuring that it is an existing directory.
 * @param {string} rootDir
 */
function checkRootDir(rootDir) {
    if (!fs.existsSync(rootDir)) {
        throw new Error('Input file ' + rootDir + ' not found');
    }
    if (!fs.lstatSync(rootDir).isDirectory()) {
        throw new Error('Input file ' + rootDir + ' is not a directory');
    }
}

module.exports = checkRootDir;

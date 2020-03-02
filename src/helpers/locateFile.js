const fs = require('fs');
const path = require('path');

/**
 * Locate file in rootDir according to href
 * @param {String} rootDir
 * @param {String} href
 */
function locateFile(rootDir, href) {
    var filePath = path.resolve(rootDir, href);

    /* file must be in rootDir */
    if (!filePath.startsWith(rootDir)) {
        return null;
    }

    /* file must exists */
    if (!fs.existsSync(filePath)) {
        return null;
    }

    /*
     * Lookup index or README in directory
     */
    if (fs.lstatSync(filePath).isDirectory()) {
        if (fs.existsSync(filePath + '/index.md')) {
            return filePath + '/index.md';
        } else if (fs.existsSync(filePath + '/README.md')) {
            return filePath + '/README.md';
        } else {
            return null;
        }
    }
    return filePath;
}

module.exports = locateFile;

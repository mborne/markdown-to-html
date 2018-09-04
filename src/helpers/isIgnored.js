/**
 * Test if a given path is ignored
 * @param {String} path 
 */
function isIgnored(path) {
    /* skip git */
    if (path.match(/\.git/))
        return true;

    return false;
}

module.exports = isIgnored;

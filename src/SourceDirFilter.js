/**
 * Test if a file is ignored (allows to ignore some directories like .git, node_modules,...)
 */
class SourceDirFilter {
    /**
     * Test if a file is ignored
     *
     * @param {string} relativePath
     *
     * @returns {boolean}
     */
    isIgnored(relativePath) {
        /* skip git */
        if (relativePath.match(/\.git/)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = SourceDirFilter;

/**
 * Test if a file is ignored (allows to ignore some directories like .git, node_modules,...)
 */
class SourceDirFilter {
    constructor() {
        this.ignoredList = [/^\.git$/, /^node_modules$/];
    }

    /**
     * Test if a file is ignored
     *
     * @param {string} relativePath
     *
     * @returns {boolean}
     */
    isIgnored(relativePath) {
        const parts = relativePath.split('/');
        for (const part of parts) {
            for (const ignoredRegex of this.ignoredList) {
                if (part.match(ignoredRegex)) {
                    return true;
                }
            }
        }
        return false;
    }
}

module.exports = SourceDirFilter;

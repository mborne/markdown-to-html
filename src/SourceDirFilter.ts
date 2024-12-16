/**
 * Test if a file is ignored (allows to ignore some directories like .git, node_modules,...)
 */
export class SourceDirFilter {
    /**
     * Regexps that match the ignored files.
     */
    private ignoredList: RegExp[];

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
    isIgnored(relativePath: string): boolean {
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

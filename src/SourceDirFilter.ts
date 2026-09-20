/**
 * Test if a file is ignored (allows to ignore some directories like .git, node_modules,...)
 */
export default class SourceDirFilter {
    private readonly ignoredList: RegExp[] = [/^\.git$/, /^node_modules$/];

    /**
     * Test if a file is ignored
     */
    isIgnored(relativePath: string): boolean {
        const parts = relativePath.split('/');
        for (const part of parts) {
            for (const ignoredRegex of this.ignoredList) {
                if (ignoredRegex.test(part)) {
                    return true;
                }
            }
        }
        return false;
    }
}

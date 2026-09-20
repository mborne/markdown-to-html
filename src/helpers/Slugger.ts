/**
 * Slugger to generate header id picked and adapted from marked v4.3.0.
 *
 * Note that it could be replaced by https://github.com/Flet/github-slugger/tree/master
 *
 * @see https://raw.githubusercontent.com/markedjs/marked/v4.3.0/src/Slugger.js
 */
export default class Slugger {
    private seen: Record<string, number> = {};

    reset(): void {
        this.seen = {};
    }

    serialize(value: string): string {
        return (
            value
                .toLowerCase()
                .trim()
                // remove html tags
                .replace(/<[!/a-z].*?>/gi, '')
                // remove unwanted chars
                .replace(
                    /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g,
                    ''
                )
                .replace(/\s/g, '-')
        );
    }

    /**
     * Finds the next safe (unique) slug to use
     */
    getNextSafeSlug(originalSlug: string, isDryRun = false): string {
        let slug = originalSlug;
        let occurenceAccumulator = 0;
        if (Object.hasOwn(this.seen, slug)) {
            occurenceAccumulator = this.seen[originalSlug] ?? 0;
            do {
                occurenceAccumulator++;
                slug = originalSlug + '-' + occurenceAccumulator;
            } while (Object.hasOwn(this.seen, slug));
        }
        if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
        }
        return slug;
    }

    /**
     * Convert string to unique id
     *
     * @param options.dryrun Generates the next unique slug without
     * updating the internal accumulator.
     */
    slug(value: string, options: { dryrun?: boolean } = {}): string {
        const slug = this.serialize(value);
        return this.getNextSafeSlug(slug, options.dryrun);
    }
}

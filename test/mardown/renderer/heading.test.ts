import heading from '../../../src/markdown/renderer/heading.js';
import { slugger } from '../../../src/helpers/slugger.js';

// reset slugger counter before each test
beforeEach(() => {
    slugger.reset();
});

describe('Test markdown/renderer/heading', function () {
    it('should invoke slugger', function () {
        const result = heading({ text: 'a great title', depth: 2, raw: 'a great title' });
        const expected = '<h2 id="a-great-title">a great title</h2>';
        expect(result).toEqual(expected);
    });

    it('should respect slugger counter', function () {
        {
            const result = heading({ text: 'a great title', depth: 2, raw: 'a great title' });
            const expected = '<h2 id="a-great-title">a great title</h2>';
            expect(result).toEqual(expected);
        }
        {
            const result = heading({ text: 'a great title', depth: 2, raw: 'a great title' });
            const expected = '<h2 id="a-great-title-1">a great title</h2>';
            expect(result).toEqual(expected);
        }
    });

    it('should support custom heading id', function () {
        const result = heading({
            text: 'a great title {#my-id}',
            depth: 2,
            raw: 'a great title {#my-id}',
        });
        const expected = '<h2 id="my-id">a great title</h2>';
        expect(result).toEqual(expected);
    });
});

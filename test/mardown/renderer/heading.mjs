import { expect } from 'chai';

import slugger from '../../../src/markdown/renderer/slugger.js';
import heading from '../../../src/markdown/renderer/heading.js';

describe('test heading', function () {
    this.beforeEach(function () {
        slugger.reset();
    });

    it('should invoke slugger', function () {
        const result = heading('a great title', 2, 'a great title');
        const expected = '<h2 id="a-great-title">a great title</h2>';
        expect(result).to.equals(expected);
    });

    it('should respect slugger counter', function () {
        {
            const result = heading('a great title', 2, 'a great title');
            const expected = '<h2 id="a-great-title">a great title</h2>';
            expect(result).to.equals(expected);
        }
        {
            const result = heading('a great title', 2, 'a great title');
            const expected = '<h2 id="a-great-title-1">a great title</h2>';
            expect(result).to.equals(expected);
        }
    });

    it('should support custom heading id', function () {
        const result = heading(
            'a great title {#my-id}',
            2,
            'a great title {#my-id}'
        );
        const expected = '<h2 id="my-id">a great title</h2>';
        expect(result).to.equals(expected);
    });
});

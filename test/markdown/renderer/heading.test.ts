import { describe, it, expect } from 'vitest';

import render from '../../../src/markdown/render.js';

/**
 * Note that the heading renderer is exercised through markdown.render as
 * marked renderers require a parser to resolve inline tokens.
 */
describe('test heading', function () {
    it('should invoke slugger', function () {
        expect(render('## a great title')).toBe(
            '<h2 id="a-great-title">a great title</h2>'
        );
    });

    it('should respect slugger counter', function () {
        expect(render('## a great title\n\n## a great title')).toBe(
            '<h2 id="a-great-title">a great title</h2>' +
                '<h2 id="a-great-title-1">a great title</h2>'
        );
    });

    it('should reset the slugger between two renderings', function () {
        render('## a great title');
        expect(render('## a great title')).toBe(
            '<h2 id="a-great-title">a great title</h2>'
        );
    });

    it('should support custom heading id', function () {
        expect(render('## a great title {#my-id}')).toBe(
            '<h2 id="my-id">a great title</h2>'
        );
    });

    it('should keep inline markup in the title but not in the id', function () {
        expect(render('## a *great* title')).toBe(
            '<h2 id="a-great-title">a <em>great</em> title</h2>'
        );
    });
});

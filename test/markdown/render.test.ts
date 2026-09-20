import { describe, it, expect } from 'vitest';

import render from '../../src/markdown/render.js';

describe('Test markdown.render', function () {
    it('should support custom id', function () {
        expect(render('# A title with a custom id {#my-id}')).toBe(
            '<h1 id="my-id">A title with a custom id</h1>'
        );
    });

    it('should support accented letters in heading', function () {
        expect(render('# Déjà vu')).toBe('<h1 id="déjà-vu">Déjà vu</h1>');
    });

    it('should not face problem with apostrophe', function () {
        expect(render("# Let's rock!")).toBe(
            '<h1 id="lets-rock">Let&#39;s rock!</h1>'
        );
    });
});

const expect = require('chai').expect;

const render = require('../../src/markdown/render');

describe('Test markdown.render', function () {
    it('should support custom id', function () {
        const result = render('# A title with a custom id {#my-id}');
        const expected =
            '<h1 id="my-id"><a href="#my-id" class="anchor"></a>A title with a custom id</h1>';
        expect(result).to.equals(expected);
    });

    it('should support accented letters in heading', function () {
        const result = render('# Déjà vu');
        const expected =
            '<h1 id="déjà-vu"><a href="#déjà-vu" class="anchor"></a>Déjà vu</h1>';
        expect(result).to.equals(expected);
    });

    it('should not face problem with apostrophe', function () {
        const result = render("# Let's rock!");
        const expected =
            '<h1 id="lets-rock"><a href="#lets-rock" class="anchor"></a>Let&#39;s rock!</h1>';
        expect(result).to.equals(expected);
    });
});

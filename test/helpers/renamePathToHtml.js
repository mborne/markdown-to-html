const expect = require('chai').expect;

const renamePathToHtml = require('../../src/helpers/renamePathToHtml');

describe('Test helper renamePathToHtml', function () {
    it('should rename .md extension', function () {
        const result = renamePathToHtml('path/to/something.md');
        const expected = 'path/to/something.html';
        expect(result).to.equals(expected);
    });

    it('should rename .phtml extension', function () {
        const result = renamePathToHtml('path/to/something.phtml');
        const expected = 'path/to/something.html';
        expect(result).to.equals(expected);
    });

    it('should not rename other extensions', function () {
        const result = renamePathToHtml('path/to/something.csv');
        const expected = 'path/to/something.csv';
        expect(result).to.equals(expected);
    });

    it('should not touch file without extensions', function () {
        const result = renamePathToHtml('path/to/something');
        const expected = 'path/to/something';
        expect(result).to.equals(expected);
    });

    it('should rename only extension', function () {
        const result = renamePathToHtml('some-dir.md/some-file.html');
        const expected = 'some-dir.md/some-file.html';
        expect(result).to.equals(expected);
    });
});

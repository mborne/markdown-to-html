import { describe, it, expect } from 'vitest';

import renamePathToHtml from '../../src/helpers/renamePathToHtml.js';

describe('Test helper renamePathToHtml', function () {
    it('should rename .md extension', function () {
        expect(renamePathToHtml('path/to/something.md')).toBe(
            'path/to/something.html'
        );
    });

    it('should rename .phtml extension', function () {
        expect(renamePathToHtml('path/to/something.phtml')).toBe(
            'path/to/something.html'
        );
    });

    it('should not rename other extensions', function () {
        expect(renamePathToHtml('path/to/something.csv')).toBe(
            'path/to/something.csv'
        );
    });

    it('should not touch file without extensions', function () {
        expect(renamePathToHtml('path/to/something')).toBe('path/to/something');
    });

    it('should rename only extension', function () {
        expect(renamePathToHtml('some-dir.md/some-file.html')).toBe(
            'some-dir.md/some-file.html'
        );
    });
});

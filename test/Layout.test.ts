import { describe, it, expect } from 'vitest';

import Layout from '../src/Layout.js';
import { PROJECT_DIR, getLayoutPath } from './helpers.js';

describe('test Layout', function () {
    describe('test constructor', function () {
        it('should ensure that layoutPath exists', function () {
            expect(() => new Layout(PROJECT_DIR + '/not-found')).toThrow();
        });

        it('should ensure that page.html exists', function () {
            expect(() => new Layout(import.meta.dirname)).toThrow();
        });
    });

    describe('test hasAssets', function () {
        it('should return false for default layout', function () {
            const layout = new Layout(getLayoutPath('default'));
            expect(layout.hasAssets()).toBe(false);
        });

        it('should return true for remarkjs layout', function () {
            const layout = new Layout(getLayoutPath('remarkjs'));
            expect(layout.hasAssets()).toBe(true);
        });
    });
});

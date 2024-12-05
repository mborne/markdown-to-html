import { getLayoutPath, getSampleDir } from './helpers';

import { Layout } from '../src/Layout';

describe('Test Layout', function () {
    describe('test constructor', function () {
        it('should ensure that layoutPath exists', function () {
            let thrown = false;
            try {
                new Layout(getLayoutPath('not-found'));
            } catch (e) {
                thrown = true;
            }
            expect(thrown).toBe(true);
        });

        it('should ensure that page.html exists', function () {
            let thrown = false;
            try {
                new Layout(getSampleDir('02-remarkjs'));
            } catch (e) {
                thrown = true;
            }
            expect(thrown).toBe(true);
        });
    });

    describe('test hasAssets', function () {
        it('should return false for default layout', function () {
            let layout = new Layout(getLayoutPath('default'));
            expect(layout.hasAssets()).toBe(false);
        });

        it('should return true for remarkjs layout', function () {
            let layout = new Layout(getLayoutPath('remarkjs'));
            expect(layout.hasAssets()).toBe(true);
        });
    });
});

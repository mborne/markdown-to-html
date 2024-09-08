import { expect } from 'chai';

import Layout from '../src/Layout.js';

const __dirname = import.meta.dirname;
import helpers from './helpers.js';

describe('test Layout', function () {
    describe('test constructor', function () {
        it('should ensure that layoutPath exists', function () {
            let thrown = false;
            try {
                new Layout(helpers.PROJ + '/not-found');
            } catch (e) {
                thrown = true;
            }
            expect(thrown).to.be.true;
        });

        it('should ensure that page.html exists', function () {
            let thrown = false;
            try {
                new Layout(__dirname);
            } catch (e) {
                thrown = true;
            }
            expect(thrown).to.be.true;
        });
    });

    describe('test hasAssets', function () {
        it('should return false for default layout', function () {
            let layout = new Layout(helpers.getLayoutPath('default'));
            expect(layout.hasAssets()).to.be.false;
        });

        it('should return true for remarkjs layout', function () {
            let layout = new Layout(helpers.getLayoutPath('remarkjs'));
            expect(layout.hasAssets()).to.be.true;
        });
    });
});

import { expect } from 'chai';

import { helpers } from './helpers';

import { Layout } from '../src/Layout';

describe('test Layout', function () {
    describe('test constructor', function () {
        it('should ensure that layoutPath exists', function () {
            let thrown = false;
            try {
                new Layout(helpers.PROJECT_DIR + '/not-found');
            } catch (e) {
                thrown = true;
            }
            expect(thrown).to.be.true;
        });

        it('should ensure that page.html exists', function () {
            let thrown = false;
            try {
                new Layout(helpers.PROJECT_DIR);
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

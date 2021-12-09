const expect = require('chai').expect;

const Layout = require('../src/Layout');

const layoutsDir = __dirname + '/../layout';

describe('test Layout', function () {
    describe('test constructor', function () {
        it('should ensure that layoutPath exists', function () {
            let thrown = false;
            try {
                new Layout(__dirname + '/not-found');
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
            let layout = new Layout(layoutsDir + '/default');
            expect(layout.hasAssets()).to.be.false;
        });

        it('should return true for remarkjs layout', function () {
            let layout = new Layout(layoutsDir + '/remarkjs');
            expect(layout.hasAssets()).to.be.true;
        });
    });
});

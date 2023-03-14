const expect = require('chai').expect;

const check = require('../../src/command/check');

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', function () {
        const rootDir = __dirname + '/../../samples/01-default-layout';
        expect(function () {
            check({
                rootDir: rootDir,
            });
        }).to.throw();
    });

    it('shout not find dead links samples/02-remarkjs', function () {
        const rootDir = __dirname + '/../../samples/02-remarkjs';
        expect(function () {
            check({
                rootDir: rootDir,
            });
        }).to.not.throw();
    });
});

const expect = require('chai').expect;
const path = require('path');

const check = require('../../src/command/check');

const SAMPLES_DIR = path.resolve(__dirname + '/../../samples');

describe('test command/check', function () {
    it('should find dead links in samples/01-default-layout', function () {
        const sourceDirPath = `${SAMPLES_DIR}/01-default-layout`;
        expect(function () {
            check(sourceDirPath);
        }).to.throw();
    });

    it('shout not find dead links samples/02-remarkjs', function () {
        const sourceDirPath = `${SAMPLES_DIR}/02-remarkjs`;
        expect(function () {
            check(sourceDirPath);
        }).to.not.throw();
    });
});

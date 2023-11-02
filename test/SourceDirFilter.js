const expect = require('chai').expect;

const SourceDirFilter = require('../src/SourceDirFilter');

const defaultFilter = new SourceDirFilter();

describe('test SourceDirFilter', function () {
    describe('test isIgnored with default SourceDirFilter', function () {
        it('should ignore .git directories', function () {
            expect(defaultFilter.isIgnored('something/.git/something-else.md'))
                .to.be.true;
        });

        it('should not ignore other files', function () {
            expect(defaultFilter.isIgnored('something/index.md')).to.be.false;
        });
    });
});

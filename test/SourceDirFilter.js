const expect = require('chai').expect;

const SourceDirFilter = require('../src/SourceDirFilter');

const defaultFilter = new SourceDirFilter();

describe('test SourceDirFilter', function () {
    describe('test isIgnored with default SourceDirFilter', function () {
        it('should ignore .git directory', function () {
            expect(defaultFilter.isIgnored('something/.git/something-else.md'))
                .to.be.true;
        });

        it('should ignore node_modules directory', function () {
            expect(defaultFilter.isIgnored('node_modules/something-else.md')).to
                .be.true;
        });

        it('should ignore node_modules sub directory', function () {
            expect(
                defaultFilter.isIgnored(
                    'something/node_modules/something-else.md'
                )
            ).to.be.true;
        });

        it('should not ignore node_modules_example directory', function () {
            expect(
                defaultFilter.isIgnored(
                    'node_modules_example/something-else.md'
                )
            ).to.be.false;
        });

        it('should not ignore other files', function () {
            expect(defaultFilter.isIgnored('something/index.md')).to.be.false;
        });
    });
});

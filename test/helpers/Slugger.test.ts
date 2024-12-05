import { expect } from 'chai';
import Slugger from '../../src/helpers/Slugger';

describe('Test helpers/Slugger', () => {
    it('should return a slugified version of the given text', () => {
        const text = 'Hello, world!';
        const expectedSlug = 'hello-world';

        const slugger = new Slugger();
        expect(slugger.slug(text)).to.equal(expectedSlug);
    });

    it('should ensure slug unicity', () => {
        const text = 'Hello, world!';
        const expectedSlug1 = 'hello-world';
        const expectedSlug2 = 'hello-world-1';

        const slugger = new Slugger();
        expect(slugger.slug(text)).to.equal(expectedSlug1);
        expect(slugger.slug(text)).to.equal(expectedSlug2);
    });
});

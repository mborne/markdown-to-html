import { Slugger } from '../../src/helpers/slugger';

describe('Test helpers/Slugger', () => {
    it('should return a slugified version of the given text', () => {
        const text = 'Hello, world!';
        const expectedSlug = 'hello-world';

        const slugger = new Slugger();
        expect(slugger.slug(text)).toEqual(expectedSlug);
    });

    it('should ensure slug unicity', () => {
        const text = 'Hello, world!';
        const expectedSlug1 = 'hello-world';
        const expectedSlug2 = 'hello-world-1';

        const slugger = new Slugger();
        expect(slugger.slug(text)).toEqual(expectedSlug1);
        expect(slugger.slug(text)).toEqual(expectedSlug2);
    });
});

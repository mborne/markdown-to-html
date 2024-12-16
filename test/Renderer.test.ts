import { Layout } from '../src/Layout';
import { Renderer } from '../src/Renderer';
import { SourceDir } from '../src/SourceDir';

import { getLayoutPath, getSampleDir } from './helpers';

const sampleSourceDir = new SourceDir(getSampleDir('01-default-layout'));
const layout = new Layout(getLayoutPath('default'));

describe('Test Renderer with 01-default-layout', () => {
    describe('render with markdown files...', () => {
        it('it should render index.md', () => {
            const renderer = new Renderer(sampleSourceDir, layout);
            const sourceFile = sampleSourceDir.locateFile('index.md');
            expect(sourceFile).not.toBeNull();
            const result = renderer.render(sourceFile);
            expect(result).toContain('<html lang="en">');
        });
    });

    describe('render with HTML view...', () => {
        it('it should render html-view/index.phtml', () => {
            const renderer = new Renderer(sampleSourceDir, layout);
            const sourceFile = sampleSourceDir.locateFile('html-view/index.phtml');
            expect(sourceFile).not.toBeNull();
            const result = renderer.render(sourceFile);
            expect(result).toContain('<html lang="en">');
        });
    });

    describe('render with static data...', () => {
        it('it should throw for html-view/data.csv', () => {
            const renderer = new Renderer(sampleSourceDir, layout);
            const sourceFile = sampleSourceDir.locateFile('html-view/data.csv');
            expect(sourceFile).not.toBeNull();
            expect(() => {
                renderer.render(sourceFile);
            }).toThrow('Unsupported file type: static');
        });
    });
});

import heading from '../../../src/markdown/renderer/heading';
import { slugger } from '../../../src/helpers/slugger';
import { Parser, Tokens } from 'marked';

// reset slugger counter before each test
beforeEach(() => {
    slugger.reset();
});

describe('Test markdown/renderer/heading', function () {
    it('should invoke slugger', function () {
        const headingToken: Tokens.Heading = {
            type: 'heading',
            raw: '## Markdown syntax\n\n',
            depth: 2,
            text: 'Markdown syntax',
            tokens: [{ type: 'text', raw: 'Markdown syntax', text: 'Markdown syntax', escaped: false }],
        };
        const result = heading(headingToken);
        const expected = '<h2 id="markdown-syntax">Markdown syntax</h2>';
        expect(result).toEqual(expected);
    });

    it('should respect slugger counter', function () {
        {
            const headingToken: Tokens.Heading = {
                type: 'heading',
                raw: '## Sequence diagram\n\n',
                depth: 2,
                text: 'Sequence diagram',
                tokens: [{ type: 'text', raw: 'Sequence diagram', text: 'Sequence diagram', escaped: false }],
            };
            const result = heading(headingToken);
            const expected = '<h2 id="sequence-diagram">Sequence diagram</h2>';
            expect(result).toEqual(expected);
        }
        {
            const headingToken: Tokens.Heading = {
                type: 'heading',
                raw: '## Sequence diagram\n\n',
                depth: 2,
                text: 'Sequence diagram',
                tokens: [{ type: 'text', raw: 'Sequence diagram', text: 'Sequence diagram', escaped: false }],
            };
            const result = heading(headingToken);
            const expected = '<h2 id="sequence-diagram-1">Sequence diagram</h2>';
            expect(result).toEqual(expected);
        }
    });

    it('should support custom heading id', function () {
        const headingToken: Tokens.Heading = {
            type: 'heading',
            raw: '## Long title with first id {#first-id}\n\n',
            depth: 2,
            text: 'Long title with first id {#first-id}',
            tokens: [
                {
                    type: 'text',
                    raw: 'Long title with first id {#first-id}',
                    text: 'Long title with first id {#first-id}',
                    escaped: false,
                },
            ],
        };

        const result = heading(headingToken);
        const expected = '<h2 id="first-id">Long title with first id</h2>';
        expect(result).toEqual(expected);
    });

    it('should not escape special chars', function () {
        const headingToken: Tokens.Heading = {
            type: 'heading',
            raw: "## That's all!\n\n",
            depth: 2,
            text: "That's all!",
            tokens: [{ type: 'text', raw: "That's all!", text: "That's all!", escaped: false }],
        };
        const result = heading(headingToken);
        const expected = '<h2 id="thats-all">That\'s all!</h2>';
        expect(result).toEqual(expected);
    });

    it('should support alternative syntax for custom ids', () => {
        const headingToken: Tokens.Heading = {
            type: 'heading',
            raw: '### [Title 3.1](#custom-31)\n\n',
            depth: 3,
            text: '[Title 3.1](#custom-31)',
            tokens: [
                {
                    type: 'link',
                    raw: '[Title 3.1](#custom-31)',
                    href: '#custom-31',
                    title: null,
                    text: 'Title 3.1',
                    tokens: [{ type: 'text', raw: 'Title 3.1', text: 'Title 3.1', escaped: false }],
                },
            ],
        };
        const result = heading(headingToken);
        const expected = '<h3 id=\"custom-31\">Title 3.1</h3>';
        expect(result).toEqual(expected);
    });
});

/*eslint-env node, mocha */

import supertest from 'supertest';

import { getLayoutPath, getSampleDir } from '../helpers';

import expressApp from '../../src/server/expressApp.js';

const sourceDirPath = getSampleDir('01-default-layout');
const layoutPath = getLayoutPath('default');
const app = expressApp(sourceDirPath, layoutPath, {});

const request = supertest(app);

describe('Test server/expressApp with samples/01-default-layout', function () {
    describe('GET /index.md', function () {
        it("return a 200 response with 'Markdown syntax' in content", async function () {
            const response = await request.get('/index.md');

            expect(response.status).toEqual(200);
            expect(response.text).toContain('Markdown syntax');
        });
    });

    describe('GET /not-found.md', function () {
        it("return a 404 response with 'Not found' in content", async function () {
            const response = await request.get('/not-found.md');

            expect(response.status).toEqual(404);
            expect(response.text).toContain('Not found');
        });
    });

    describe('Testing index resolution', function () {
        describe('GET /subdir-index/', function () {
            it("return a 200 response with 'with an index.md file' in content", async function () {
                const response = await request.get('/subdir-index/');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('with an index.md file');
            });
        });

        describe('GET /subdir-readme/', function () {
            it("return a 200 response with 'with an index.md file' in content", async function () {
                const response = await request.get('/subdir-readme/');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('with an README.md file');
            });
        });

        describe('GET /no-index/', function () {
            it("return a 404 response with 'Not found' in content", async function () {
                const response = await request.get('/no-index/');

                expect(response.status).toEqual(404);
                expect(response.text).toEqual('Not found');
            });
        });
    });

    describe('Testing HTML view', function () {
        describe('GET /01-default-layout/html-view/', function () {
            it("return a 200 response with 'This is an HTML view' in content", async function () {
                const response = await request.get('/html-view/');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('This is an HTML view');
            });
        });

        describe('GET /01-default-layout/html-view/index.html', function () {
            it("return a 200 response with 'This is an HTML view' in content", async function () {
                // TODO : improve to allow .html
                const response = await request.get('/html-view/index.phtml');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('This is an HTML view');
            });
        });

        describe('GET /html-view/data.csv', function () {
            it("return a 200 response with 'id,name' in content", async function () {
                const response = await request.get('/html-view/data.csv');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('id,name');
            });
        });
    });

    describe('Testing HTML page', function () {
        describe('GET /01-default-layout/html-page/', function () {
            it("return a 200 response with 'This is an HTML view' in content", async function () {
                const response = await request.get('/html-page/');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('<title>HTML page</title>');
            });
        });

        describe('GET /01-default-layout/html-page/index.html', function () {
            it("return a 200 response with 'This is an HTML view' in content", async function () {
                const response = await request.get('/html-page/index.html');

                expect(response.status).toEqual(200);
                expect(response.text).toContain('<title>HTML page</title>');
            });
        });
    });

    describe('Testing redirect for directories', function () {
        describe('GET /subdir-index', function () {
            it('return a 302 response to /subdir-index/', async function () {
                const response = await request.get('/subdir-index');

                expect(response.status).toEqual(302);
                expect(response.headers.location).toContain('subdir-index/');
            });
        });

        describe('GET /subdir-index?page=10', function () {
            it('return a 301 response to /subdir-index/ as query string is ignored', async function () {
                const response = await request.get('/subdir-index?page=10');

                expect(response.status).toEqual(302);
                expect(response.headers.location).toContain('subdir-index/');
            });
        });
    });

    describe('Testing path traversal', function () {
        describe('GET /../../package.json', function () {
            it('return a 404 response', async function () {
                const response = await request.get('/../../package.json');

                expect(response.status).toEqual(404);
                expect(response.text).toEqual('Not found');
            });
        });
    });
});

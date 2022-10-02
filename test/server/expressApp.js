/*eslint-env node, mocha */

const supertest = require('supertest');
const expect = require('chai').expect;

const expressApp = require('../../src/server/expressApp');
const app = expressApp({
    rootDir: __dirname + '/../../samples/01-default-layout',
    layoutPath: __dirname + '/../../layout/default',
});

const request = supertest(app);

describe('Testing expressApp with samples/01-default-layout', function () {
    describe('GET /', function () {
        it("return a 200 response with 'Markdown syntax' in content", async function () {
            const response = await request.get('/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('Markdown syntax');
        });
    });

    describe('GET /not-found.md', function () {
        it("return a 404 response with 'Not found' in content", async function () {
            const response = await request.get('/not-found.md');

            expect(response.status).to.eql(404);
            expect(response.text).to.contains('Not found');
        });
    });

    describe('GET /subdir-index/', function () {
        it("return a 200 response with 'with an index.md file' in content", async function () {
            const response = await request.get('/subdir-index/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('with an index.md file');
        });
    });

    describe('GET /no-index/', function () {
        it("return a 404 response with 'Not found' in content", async function () {
            const response = await request.get('/no-index/');

            expect(response.status).to.eql(404);
            expect(response.text).to.contains('Not found');
        });
    });
});

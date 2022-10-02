/*eslint-env node, mocha */

const supertest = require('supertest');
const expect = require('chai').expect;

const expressApp = require('../../src/server/expressApp');
const app = expressApp({
    rootDir: __dirname + '/../../samples/02-remarkjs',
    layoutPath: __dirname + '/../../layout/remarkjs',
});

const request = supertest(app);

describe('Testing expressApp with samples/02-remarkjs (with assets)', async function () {
    describe('GET /', function () {
        it("return a 200 response with 'RemarkJS layout' in content", async function () {
            const response = await request.get('/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('RemarkJS layout');
        });
    });
});

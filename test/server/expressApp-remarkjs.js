/*eslint-env node, mocha */

const supertest = require('supertest');
const expect = require('chai').expect;
const expressApp = require('../../src/server/expressApp');

const sourceDirPath = __dirname + '/../../samples/02-remarkjs';
const layoutPath = __dirname + '/../../layout/remarkjs';
const app = expressApp(sourceDirPath, layoutPath);

const request = supertest(app);

/**
 * Complete expressApp-default.js with a layout embedding assets.
 */
describe('Testing expressApp with samples/02-remarkjs', async function () {
    describe('GET /', async function () {
        it("return a 200 response with 'RemarkJS layout' in content", async function () {
            const response = await request.get('/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('RemarkJS layout');
        });
    });
});

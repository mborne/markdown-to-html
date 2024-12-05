/*eslint-env node, mocha */

import { expect } from 'chai';
import supertest from 'supertest';

import { getLayoutPath, getSampleDir } from '../helpers';

import expressApp from '../../src/server/expressApp.js';

const sourceDirPath = getSampleDir('02-remarkjs');
const layoutPath = getLayoutPath('remarkjs');
const app = expressApp(sourceDirPath, layoutPath, {});

const request = supertest(app);

/**
 * Complete expressApp-default.js with a layout embedding assets.
 */
describe('Test server/expressApp with samples/02-remarkjs', function () {
    describe('GET /', function () {
        it("return a 200 response with 'RemarkJS layout' in content", async function () {
            const response = await request.get('/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('RemarkJS layout');
        });
    });
});

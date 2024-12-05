/*eslint-env node, mocha */

import { expect } from 'chai';
import supertest from 'supertest';

import { helpers } from '../helpers';

import expressApp from '../../src/server/expressApp.js';

const sourceDirPath = helpers.getSampleDir('02-remarkjs');
const layoutPath = helpers.getLayoutPath('remarkjs');
const app = expressApp(sourceDirPath, layoutPath, {});

const request = supertest(app);

/**
 * Complete expressApp-default.js with a layout embedding assets.
 */
describe('Testing expressApp with samples/02-remarkjs', function () {
    describe('GET /', function () {
        it("return a 200 response with 'RemarkJS layout' in content", async function () {
            const response = await request.get('/');

            expect(response.status).to.eql(200);
            expect(response.text).to.contains('RemarkJS layout');
        });
    });
});

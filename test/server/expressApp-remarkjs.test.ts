import { describe, it, expect } from 'vitest';
import supertest from 'supertest';

import expressApp from '../../src/server/expressApp.js';
import { getLayoutPath, getSampleDir } from '../helpers.js';

const sourceDirPath = getSampleDir('02-remarkjs');
const layoutPath = getLayoutPath('remarkjs');
const app = expressApp(sourceDirPath, layoutPath);

const request = supertest(app);

/**
 * Complete expressApp-default.test.ts with a layout embedding assets.
 */
describe('Testing expressApp with samples/02-remarkjs', function () {
    describe('GET /', function () {
        it("return a 200 response with 'RemarkJS layout' in content", async function () {
            const response = await request.get('/');

            expect(response.status).toBe(200);
            expect(response.text).toContain('RemarkJS layout');
        });
    });
});

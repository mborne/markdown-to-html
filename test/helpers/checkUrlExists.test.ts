import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';

import checkUrlExists from '../../src/helpers/checkUrlExists.js';

/*
 * A local HTTP server is used rather than a remote website
 * so that the tests don't depend on the network.
 */
const server = http.createServer(function (req, res) {
    switch (req.url) {
        case '/found':
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('found');
            return;
        case '/redirect':
            res.writeHead(302, { Location: '/found' });
            res.end();
            return;
        case '/slow':
            // never answers (checkUrlExists timeout is 1000 ms)
            return;
        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('not found');
    }
});

let baseUrl = '';

beforeAll(async function () {
    await new Promise<void>((resolve) =>
        server.listen(0, '127.0.0.1', resolve)
    );
    const { port } = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async function () {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
});

describe('Test helper checkUrlExists', function () {
    it('should find an URL returning 200', async function () {
        expect(await checkUrlExists(`${baseUrl}/found`)).toBe(true);
    });

    it('should follow redirects', async function () {
        expect(await checkUrlExists(`${baseUrl}/redirect`)).toBe(true);
    });

    it('should not find an URL returning 404', async function () {
        expect(await checkUrlExists(`${baseUrl}/not-found`)).toBe(false);
    });

    it('should not find an URL timing out', async function () {
        expect(await checkUrlExists(`${baseUrl}/slow`)).toBe(false);
    }, 5000);

    it('should not find an URL on a closed port', async function () {
        const closedServer = http.createServer();
        await new Promise<void>((resolve) =>
            closedServer.listen(0, '127.0.0.1', resolve)
        );
        const { port } = closedServer.address() as AddressInfo;
        await new Promise<void>((resolve) =>
            closedServer.close(() => resolve())
        );

        expect(await checkUrlExists(`http://127.0.0.1:${port}/found`)).toBe(
            false
        );
    });
});

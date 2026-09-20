import createDebug from 'debug';
import axios from 'axios';

import http from 'node:http';
import https from 'node:https';

const debug = createDebug('markdown-to-html');

/**
 * Test if URL exists.
 */
export default async function checkUrlExists(url: string): Promise<boolean> {
    debug(`checkUrlExists('${url}')...`);
    try {
        const response = await axios.get(url, {
            responseType: 'stream',
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        });
        debug(`checkUrlExists('${url}') : SUCCESS (${response.status})`);
        return true;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        debug(`checkUrlExists('${url}') : FAILURE (${message})`);
        return false;
    }
}

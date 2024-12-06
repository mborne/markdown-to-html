import { logger } from '../logger.js';

import axios from 'axios';

import http from 'http';
import https from 'https';

/**
 * Test if URL exists.
 *
 * @param {string} url
 * @returns {boolean}
 */
export default async function checkUrlExists(url) {
    logger.info(`checkUrlExists('${url}')...`);
    try {
        let response = await axios.get(url, {
            responseType: 'stream',
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        });
        logger.info(`checkUrlExists('${url}') : SUCCESS (${response.status})`);
        return true;
    } catch (error) {
        logger.info(`checkUrlExists('${url}') : FAILURE (${error.message})`);
        return false;
    }
}

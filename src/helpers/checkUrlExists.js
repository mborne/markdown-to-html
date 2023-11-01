const debug = require('debug')('markdown-to-html');
const axios = require('axios');

const http = require('http');
const https = require('https');

/**
 * Test if URL exists.
 *
 * @param {string} url
 * @returns {boolean}
 */
async function checkUrlExists(url) {
    debug(`checkUrlExists('${url}')...`);
    try {
        let response = await axios.get(url, {
            responseType: 'stream',
            timeout: 1000,
            httpAgent: new http.Agent({ keepAlive: false }),
            httpsAgent: new https.Agent({ keepAlive: false }),
        });
        debug(`checkUrlExists('${url}') : SUCCESS (${response.status})`);
        return true;
    } catch (error) {
        debug(`checkUrlExists('${url}') : FAILURE (${error.message})`);
        return false;
    }
}

module.exports = checkUrlExists;

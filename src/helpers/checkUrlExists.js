const debug = require('debug')('markdown-to-html');
const axios = require('axios');

/**
 * Test if URL exists.
 *
 * @param {string} url
 * @returns
 */
async function checkUrlExists(url) {
    debug(`checkUrlExists('${url}')...`);
    try {
        let response = await axios.get(url, {
            responseType: 'stream',
        });
        debug(`checkUrlExists('${url}') : SUCCESS (${response.status})`);
        return true;
    } catch (error) {
        debug(`checkUrlExists('${url}') : FAILURE (${error.response.status})`);
        return false;
    }
}

module.exports = checkUrlExists;
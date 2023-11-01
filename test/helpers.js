const path = require('path');
const fs = require('fs');

const helpers = {
    /**
     * Get path to file in test/data directory
     *
     * @param {string} relativePath
     */
    getTestDataPath(relativePath) {
        return path.resolve(__dirname + '/data/', relativePath);
    },

    /**
     * Get path to file in test/data directory
     *
     * @param {string} relativePath
     */
    getTestDataContent(relativePath) {
        return fs.readFileSync(this.getTestDataPath(relativePath), 'utf-8');
    },
};

module.exports = helpers;

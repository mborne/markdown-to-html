const fs = require('fs');

/**
 * Check layoutPath option. Ensure that {layoutPath}/page.html exists.
 *
 * @param {string} layoutPath
 */
function checkLayoutPath(layoutPath) {
    if (!fs.existsSync(layoutPath)) {
        throw new Error(layoutPath + " doesn't exists!");
    }
    if (!fs.existsSync(layoutPath + '/page.html')) {
        throw new Error(layoutPath + "/page.html doesn't exists!");
    }
}

module.exports = checkLayoutPath;

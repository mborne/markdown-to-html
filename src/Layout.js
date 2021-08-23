const fs = require('fs');

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
class Layout {
    /**
     * @param {string} layoutPath path to the directory containing page.html
     */
    constructor(layoutPath) {
        if (!fs.existsSync(layoutPath)) {
            throw new Error(layoutPath + " doesn't exists!");
        }
        if (!fs.existsSync(layoutPath + '/page.html')) {
            throw new Error(layoutPath + "/page.html doesn't exists!");
        }
        this.path = layoutPath;
    }
}

module.exports = Layout;

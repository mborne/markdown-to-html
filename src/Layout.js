const fs = require('fs');

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
class Layout {
    /**
     * @param {string} layoutPath path to the directory containing page.html
     */
    constructor(layoutPath) {
        this.path = layoutPath;
        if (!fs.existsSync(this.path)) {
            throw new Error(`${this.path} doesn't exists`);
        }
        this.templatePath = this.path + '/page.html';
        if (!fs.existsSync(this.templatePath)) {
            throw new Error(`${this.templatePath} doesn't exists`);
        }

        this.assetsPath = this.path + '/assets';
    }

    /**
     * @returns boolean
     */
    hasAssets() {
        return fs.existsSync(this.assetsPath);
    }
}

module.exports = Layout;

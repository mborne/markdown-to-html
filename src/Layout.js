import fs from 'fs';

import handlebars from 'handlebars';

import { asset } from './handlebars/asset.js';
handlebars.registerHelper('asset', asset);

import { url } from './handlebars/url.js';
handlebars.registerHelper('url', url);

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
export class Layout {
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

    /**
     * Get handlebar's template.
     *
     * @returns {HandlebarsTemplateDelegate<T>}
     */
    getTemplate() {
        const templateSource = fs.readFileSync(
            this.path + '/page.html',
            'utf8'
        );
        return handlebars.compile(templateSource);
    }
}

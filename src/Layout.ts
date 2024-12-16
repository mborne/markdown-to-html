import fs from 'fs';

import handlebars from 'handlebars';

import { asset } from './handlebars/asset';
handlebars.registerHelper('asset', asset);

import { url } from './handlebars/url';
handlebars.registerHelper('url', url);

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
export class Layout {
    /**
     * @property {string} layoutPath path to the directory containing page.html
     */
    private layoutPath: string;
    /**
     * @property {string} templatePath path to the page.html template file
     */
    private templatePath: string;
    /**
     * @property {string} assetsPath path to the assets directory
     */
    private assetsPath: string;

    /**
     * @param {string} layoutPath path to the directory containing page.html
     */
    constructor(layoutPath) {
        this.layoutPath = layoutPath;
        if (!fs.existsSync(this.layoutPath)) {
            throw new Error(`${this.layoutPath} doesn't exists`);
        }
        this.templatePath = this.layoutPath + '/page.html';
        if (!fs.existsSync(this.templatePath)) {
            throw new Error(`${this.templatePath} doesn't exists`);
        }

        this.assetsPath = this.layoutPath + '/assets';
    }

    /**
     * @returns the path of the layout directory.
     */
    getPath(): string {
        return this.layoutPath;
    }

    /**
     * Check if the assets directory exists.
     */
    hasAssets(): boolean {
        return fs.existsSync(this.assetsPath);
    }

    /**
     * Get handlebar's template.
     */
    getTemplate(): HandlebarsTemplateDelegate {
        const templateSource = fs.readFileSync(this.layoutPath + '/page.html', 'utf8');
        return handlebars.compile(templateSource);
    }
}

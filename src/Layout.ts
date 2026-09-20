import fs from 'node:fs';
import handlebars from 'handlebars';

import asset from './handlebars/asset.js';
import url from './handlebars/url.js';
import type { RenderContext } from './types.js';

handlebars.registerHelper('asset', asset);
handlebars.registerHelper('url', url);

/**
 * Handlebars based layout with a template page.html and an optional assets directory.
 */
export default class Layout {
    /** path to the directory containing page.html */
    readonly path: string;
    readonly templatePath: string;
    readonly assetsPath: string;

    constructor(layoutPath: string) {
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

    hasAssets(): boolean {
        return fs.existsSync(this.assetsPath);
    }

    /**
     * Get handlebar's template.
     */
    getTemplate(): HandlebarsTemplateDelegate<RenderContext> {
        const templateSource = fs.readFileSync(this.templatePath, 'utf8');
        return handlebars.compile<RenderContext>(templateSource);
    }
}

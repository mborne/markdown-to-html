import path from 'path';
import fs from 'fs';

import os from 'os';
import { v4 as uuidV4 } from 'uuid';

const PROJECT_DIR = path.resolve(__dirname + '/../');
const SAMPLES_DIR = path.resolve(__dirname + '/../samples');

export const helpers = {
    PROJECT_DIR: PROJECT_DIR,

    /**
     * Get path to samples/{sampleName}
     *
     * @param {string} sampleName
     * @returns {string}
     */
    getSampleDir(sampleName) {
        return path.resolve(SAMPLES_DIR, sampleName);
    },

    /**
     * Get path to a layout.
     *
     * @param {string} layoutName
     * @returns {string}
     */
    getLayoutPath(layoutName) {
        return path.resolve(PROJECT_DIR, `layout/${layoutName}`);
    },

    /**
     * Get temp directory path
     *
     * @returns {string}
     */
    getTempDirPath() {
        return os.tmpdir() + '/md2html-' + uuidV4();
    },

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

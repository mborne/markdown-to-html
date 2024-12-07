import path from 'path';
import fs from 'fs';

import os from 'os';
import { v4 as uuidV4 } from 'uuid';

const __dirname = import.meta.dirname;
export const PROJECT_DIR = path.resolve(__dirname + '/../');
export const SAMPLES_DIR = path.resolve(PROJECT_DIR, './samples');

/**
 * Get path to samples/{sampleName}
 */
export function getSampleDir(sampleName: string): string {
    return path.resolve(SAMPLES_DIR, sampleName);
}

/**
 * Get path to a layout.
 */
export function getLayoutPath(layoutName: string): string {
    return path.resolve(PROJECT_DIR, `layout/${layoutName}`);
}

/**
 * Generate temp directory path
 */
export function getTempDirPath(): string {
    return os.tmpdir() + '/md2html-' + uuidV4();
}

/**
 * Get absolute path test/data/${relativePath}
 */
export function getTestDataPath(relativePath): string {
    return path.resolve(PROJECT_DIR, `test/data/${relativePath}`);
}

/**
 * Get content of test/data/${relativePath}
 */
export function getTestDataContent(relativePath: string): string {
    return fs.readFileSync(getTestDataPath(relativePath), 'utf-8');
}

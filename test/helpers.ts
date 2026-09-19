import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { randomUUID } from 'node:crypto';

export const PROJECT_DIR = path.resolve(import.meta.dirname, '..');
const SAMPLES_DIR = path.resolve(PROJECT_DIR, 'samples');

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
 * Get temp directory path
 */
export function getTempDirPath(): string {
    return path.join(os.tmpdir(), `md2html-${randomUUID()}`);
}

/**
 * Get path to file in test/data directory
 */
export function getTestDataPath(relativePath: string): string {
    return path.resolve(import.meta.dirname, 'data', relativePath);
}

/**
 * Get content of a file in test/data directory
 */
export function getTestDataContent(relativePath: string): string {
    return fs.readFileSync(getTestDataPath(relativePath), 'utf-8');
}

import path from 'node:path';

/**
 * Root directory of the package.
 *
 * Note that it is computed once here so that modules at different depths
 * in the build output (dist/index.js, dist/bin/main.js, ...) don't have to
 * each guess how many levels up the package root is.
 */
export const PACKAGE_ROOT = path.resolve(import.meta.dirname, '..');

/**
 * Directory containing the embedded layouts.
 */
export const LAYOUTS_DIR = path.join(PACKAGE_ROOT, 'layout');

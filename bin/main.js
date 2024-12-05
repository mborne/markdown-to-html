#!/usr/bin/env node




import { program, Option } from 'commander';

import path from 'path';

const VERSION = process.env.npm_package_version;
const __dirname = import.meta.dirname;
const PROJECT_DIR = path.resolve(__dirname, '..');
const LAYOUTS_DIR = path.resolve(PROJECT_DIR, './layout');

import convert from '../src/command/convert.js';
import serve from '../src/command/serve.js';
import check from '../src/command/check.js';

const optionLang = new Option(
    '--language <language>',
    'Default value for HTML lang metadata if not overwritten by YAML metadata (lang)'
).env('LANGUAGE').default('en');

const optionLayout = new Option(
    '-l, --layout <layout>',
    'Name or path to the layout'
).env('LAYOUT').default('default');

// TODO : list folders from LAYOUTS_DIR
import { layoutNames } from '../layout/index.js';

/**
 * Get layout path by name.
 *
 * @param {string} layoutName
 * @returns {string}
 */
function getLayoutPath(layoutName) {
    return layoutNames.indexOf(layoutName) < 0
        ? path.resolve(layoutName)
        : path.resolve(LAYOUTS_DIR, `./${layoutName}`);
}

program.version(VERSION);

program
    .command('convert <sourceDir> <outputDir>')
    .description('generate static site from source')
    .addOption(optionLayout)
    .addOption(optionLang)
    .action(function (sourceDir, outputDir, options) {
        const sourceDirPath = path.resolve(sourceDir);
        const outputDirPath = path.resolve(outputDir);
        const layoutPath = getLayoutPath(options.layout);
        try {
            convert(sourceDirPath, outputDirPath, layoutPath, options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('serve <sourceDir>')
    .description('serve source directory')
    .addOption(optionLayout)
    .addOption(optionLang)
    .action(function (sourceDir, options) {
        const sourceDirPath = path.resolve(sourceDir);
        const layoutPath = getLayoutPath(options.layout);
        try {
            serve(sourceDirPath, layoutPath, options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('check <sourceDir>')
    .description('check source directory')
    .option(
        '--check-external-links',
        'also check external links (performs HTTP requests)'
    )
    .action(async function (sourceDir, options) {
        const sourceDirPath = path.resolve(sourceDir);
        try {
            await check(sourceDirPath, options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

if (process.argv.length <= 2) {
    program.outputHelp();
    process.exit(1);
}

program.parse(process.argv);

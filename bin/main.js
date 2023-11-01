#!/usr/bin/env node

const packageMetadata = require('../package.json');

const program = require('commander');
const path = require('path');

const modes = {
    convert: require('../src/command/convert'),
    serve: require('../src/command/serve'),
    check: require('../src/command/check'),
};

program.version(packageMetadata.version);

const optionLang = new program.Option(
    '--language <language>',
    'Default value for HTML lang metadata if not overwritten by YAML metadata (lang)'
)
    .env('LANGUAGE')
    .default('en');

const optionLayout = new program.Option(
    '-l, --layout <layout>',
    'Name or path to the layout'
)
    .env('LAYOUT')
    .default('default');

/**
 * Get layout path by name.
 *
 * @param {string} layoutName
 * @returns {string}
 */
function getLayoutPath(layoutName) {
    let layoutNames = require('../layout');
    return layoutNames.indexOf(layoutName) < 0
        ? path.resolve(layoutName)
        : path.resolve(__dirname, `../layout/${layoutName}`);
}

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
            modes.convert(sourceDirPath, outputDirPath, layoutPath, options);
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
            modes.serve(sourceDirPath, layoutPath, options);
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
            await modes.check(sourceDirPath, options);
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

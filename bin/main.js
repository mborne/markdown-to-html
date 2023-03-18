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
    .option(
        '-l, --layout <layout>',
        'Name or path to the layout',
        path.resolve(__dirname + '/../layout/default')
    )
    .action(function (sourceDir, outputDir, cmd) {
        const sourceDirPath = path.resolve(sourceDir);
        const outputDirPath = path.resolve(outputDir);
        const layoutPath = getLayoutPath(cmd.layout);
        try {
            modes.convert(sourceDirPath, outputDirPath, layoutPath);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('serve <sourceDir>')
    .description('serve source directory')
    .option(
        '-l, --layout <layout>',
        'Name or path to the layout',
        path.resolve(__dirname + '/../layout/default')
    )
    .action(function (sourceDir, cmd) {
        const sourceDirPath = path.resolve(sourceDir);
        const layoutPath = getLayoutPath(cmd.layout);
        try {
            modes.serve(sourceDirPath, layoutPath);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('check <sourceDir>')
    .description('check source directory')
    .action(async function (sourceDir) {
        const sourceDirPath = path.resolve(sourceDir);
        try {
            await modes.check(sourceDirPath);
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

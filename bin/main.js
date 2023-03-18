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
    .command('convert <source>')
    .description('generate static site from source')
    .option(
        '-l, --layout <layout>',
        'Name or path to the layout',
        path.resolve(__dirname + '/../layout/default')
    )
    .option(
        '-O, --output <output>',
        'Path to output dir',
        path.resolve('output')
    )
    .action(function (source, cmd) {
        /* build sub-command options */
        const options = {
            rootDir: path.resolve(source),
            layoutPath: getLayoutPath(cmd.layout),
            outputDir: path.resolve(cmd.output),
        };
        try {
            modes.convert(options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('serve <source>')
    .description('serve source directory')
    .option(
        '-l, --layout <layout>',
        'Name or path to the layout',
        path.resolve(__dirname + '/../layout/default')
    )
    .action(function (source, cmd) {
        /* build sub-command options */
        const options = {
            rootDir: path.resolve(source),
            layoutPath: getLayoutPath(cmd.layout),
        };
        try {
            modes.serve(options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    });

program
    .command('check <source>')
    .description('check source directory')
    .action(function (source, cmd) {
        const options = {
            rootDir: path.resolve(source),
        };
        try {
            modes.check(options);
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

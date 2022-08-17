#!/usr/bin/env node

const packageMetadata = require('../package.json');

const program = require('commander');
const path = require('path');
const RendererMode = require('../src/RendererMode');

const modes = {
    convert: require('../src/command/convert'),
    serve: require('../src/command/serve'),
};

program
    .version(packageMetadata.version)
    .arguments('<source>')
    .option(
        '-m, --mode <mode>',
        'Program mode',
        /^(convert|serve)$/i,
        RendererMode.CONVERT
    )
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
        const mode = cmd.mode;

        /* resolve layout name or path */
        let layoutNames = require('../layout');
        let layoutPath =
            layoutNames.indexOf(cmd.layout) < 0
                ? path.resolve(cmd.layout)
                : path.resolve(__dirname, `../layout/${cmd.layout}`);

        /* build sub-command options */
        var options = {
            mode: mode,
            rootDir: path.resolve(source),
            layoutPath: layoutPath,
            outputDir: path.resolve(cmd.output),
        };
        try {
            modes[mode](options);
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

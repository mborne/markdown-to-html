#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const modes = {
    convert: require('../src/command/convert'),
    serve: require('../src/command/serve'),
};

program
    .version('0.5.0')
    .arguments('<source>')
    .option(
        '-m, --mode <mode>',
        'Program mode',
        /^(convert|serve)$/i,
        'convert'
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
    .action(function(source) {
        const mode = program.mode;

        // TODO require('../layout')
        let layoutNames = ['default', 'github', 'github-mermaid', 'remarkjs'];
        let layoutPath =
            layoutNames.indexOf(program.layout) < 0
                ? path.resolve(program.layout)
                : path.resolve(__dirname, `../layout/${program.layout}`);
        var options = {
            mode: mode,
            rootDir: path.resolve(source),
            layoutPath: layoutPath,
            outputDir: path.resolve(program.output),
        };
        try {
            modes[mode](options);
        } catch (e) {
            console.error(e.message);
            process.exit(1);
        }
    })
    .parse(process.argv);

if (program.args.length === 0) {
    program.help();
}

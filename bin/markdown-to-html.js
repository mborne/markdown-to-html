#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const convert = require('../src/command/convert');

program
  .version('0.1.0')
  .arguments('<source>')
  .option('-l, --layout <layout>', 'Path to the layout', path.resolve(__dirname+'/../layout'))
  .option('-o, --output <output>', 'Path to output dir', path.resolve('output'))
  .action(function(source){
    var options = {
        mode: 'convert',
        rootDir: path.resolve(source),
        layoutPath: path.resolve(program.layout),
        outputDir: path.resolve(program.output)
    };
    convert(options);
  })
  .parse(process.argv)
;

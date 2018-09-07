#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const modes = {
  'convert': require('../src/command/convert'),
  'serve' : require('../src/command/serve')
}

program
  .version('0.1.0')
  .arguments('<source>')
  .option('-m, --mode <mode>', 'Program mode', /^(convert|serve)$/i, 'convert')
  .option('-l, --layout <layout>', 'Path to the layout', path.resolve(__dirname+'/../layout'))
  .option('-O, --output <output>', 'Path to output dir', path.resolve('output'))
  .action(function(source){
    const mode = program.mode;
    var options = {
        mode: mode,
        rootDir: path.resolve(source),
        layoutPath: path.resolve(program.layout),
        outputDir: path.resolve(program.output)
    };
    try {
      modes[mode](options);
    }catch(e){
      console.error(e.message);
      process.exit(1);
    }
  })
  .parse(process.argv)
;

if (program.args.length === 0){
  program.help();
}

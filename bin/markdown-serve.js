#!/usr/bin/env node

const program = require('commander');
const path = require('path');

const serve = require('../src/command/serve');

program
  .version('0.1.0')
  .arguments('<source>')
  .option('-l, --layout <layout>', 'Path to the layout', path.resolve(__dirname+'/../layout'))
  .action(function(source){
    var options = {
        mode: 'serve',
        rootDir: path.resolve(source),
        layoutPath: path.resolve(program.layout)
    };
    serve(options);
  })
  .parse(process.argv)
;

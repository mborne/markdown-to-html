const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const MarkdownRenderer = require('./src/MarkdownRenderer');

/* root directory */
const rootDir = process.argv[2];
if ( ! fs.existsSync(rootDir) ){
    console.log("Input file not found");
    process.exit(1);
}
if ( ! fs.lstatSync(rootDir).isDirectory() ){
    console.log("Input file is not a directory");
    process.exit(1);
}

/* output directory */
const outputPath = path.resolve('output');
console.log(outputPath);
if ( fs.existsSync(outputPath) ){
    console.log(outputPath+"already exists!");
}
shell.mkdir('-p',outputPath);

/* template path */
const layoutPath = path.resolve(__dirname+'/layout');

function isIgnored(path){
    /* skip git */
    if ( path.match(/\.git/) )
        return true;

    return false;
}

/* Computes operations to perform */

var operations = [];

var inputFiles = shell.find(rootDir);
inputFiles.forEach(function(inputFile){
    var relativePath = path.relative(rootDir,inputFile);
    if ( isIgnored(relativePath) ){
        return;
    }
    if ( relativePath.match(/\.md$/) ){
        var newRelativePath = relativePath.substr(relativePath,relativePath.length-3)+'.html';
        operations.push({
            type: 'md2html',
            inputFile: inputFile,
            relativePath: relativePath,
            newRelativePath: newRelativePath,
            outputFile: outputPath+'/'+newRelativePath
        });
    }else if ( fs.lstatSync(inputFile).isDirectory() ){
        operations.push({
            type: 'mkdir',
            inputFile: inputFile,
            relativePath: relativePath,
            newRelativePath: relativePath,
            outputFile: outputPath+'/'+relativePath
        });
    }else{
        operations.push({
            type: 'copy',
            inputFile: inputFile,
            relativePath: relativePath,
            newRelativePath: relativePath,
            outputFile: outputPath+'/'+relativePath
        });
    }
});


/* Copy assets */
const assertsDir = outputPath+'/assets';
shell.cp('-r',layoutPath+'/assets',assertsDir);

/* Create directories */
operations.filter(function(operation){return operation.type === 'mkdir'}).forEach(function(operation){
    console.log("mkdir "+operation.outputFile);
    shell.mkdir("-p",operation.outputFile);
});

/* Copy static files */
operations.filter(function(operation){return operation.type === 'copy'}).forEach(function(operation){
    console.log("copy "+operation.inputFile+" to "+operation.outputFile);
    shell.cp(operation.inputFile, operation.outputFile);
});

/* Render markdown files */
var markdownRenderer = new MarkdownRenderer(
    rootDir,
    layoutPath
);
operations.filter(function(operation){return operation.type === 'md2html'}).forEach(function(operation){
    console.log("render "+operation.inputFile+" to "+operation.outputFile);
    var html = markdownRenderer.renderFile(operation.inputFile);
    fs.writeFileSync(operation.outputFile,html);
});




const shell = require('shelljs');
const fs = require('fs');
const path = require('path');
const renderMarkdown = require('./src/renderMarkdown');

const layoutPath = path.resolve(__dirname+'/layout');

const inputPath = process.argv[2];
if ( ! fs.existsSync(inputPath) ){
    console.log("Input file not found");
    process.exit(1);
}
if ( ! fs.lstatSync(inputPath).isDirectory() ){
    console.log("Input file is not a directory");
    process.exit(1);
}

const outputPath = path.resolve('output');
console.log(outputPath);
if ( fs.existsSync(outputPath) ){
    console.log(outputPath+"already exists!");
}
shell.mkdir('-p',outputPath);


function isIgnored(path){
    /* skip git */
    if ( path.match(/\.git/) )
        return true;

    return false;
}


/* Computes operations to perform */

var operations = [];

var inputFiles = shell.find(inputPath);
inputFiles.forEach(function(inputFile){
    var relativePath = path.relative(inputPath,inputFile);
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

var context = {
    title: 'none',
    assertsDir: assertsDir
}

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
const handlebars = require('handlebars');

handlebars.registerHelper('asset',require('./src/helpers/asset'));

operations.filter(function(operation){return operation.type === 'md2html'}).forEach(function(operation){
    console.log("render "+operation.inputFile+" to "+operation.outputFile);
    var content = renderMarkdown(operation.inputFile);

    handlebars.registerPartial('content', content);

    var templateSource = fs.readFileSync(layoutPath+'/page.html', "utf8");
    var template = handlebars.compile(templateSource);
    context.content = content;
    context.outputFile = operation.outputFile;
    var html = template(context);
    console.log(html);
    fs.writeFileSync(operation.outputFile,html);
});




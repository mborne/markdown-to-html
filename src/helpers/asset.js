var handlebars = require('handlebars');
var path = require('path');

module.exports = function(context, options) {
    const relativePath = path.relative(
        path.resolve(options.data.root.outputFile,'..'),
        options.data.root.assertsDir
    );

    var output = '';
    output += relativePath + '/';
    context = context.replace(/^\//, '');
    output += context;

    return new handlebars.SafeString(output);
};
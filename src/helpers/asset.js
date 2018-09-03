var handlebars = require('handlebars');
var path = require('path');

module.exports = function(context, options) {
    const relativePath = path.relative(
        path.resolve(options.data.root.path,'..'),
        options.data.root.rootDir+'/assets'
    );

    var output = '';
    output += relativePath + '/';
    context = context.replace(/^\//, '');
    output += context;

    return new handlebars.SafeString(output);
};
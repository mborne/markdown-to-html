const fs = require('fs');

/**
 * Check rootDir option
 * @param {string} rootDir 
 */
function checkLayoutPath(layoutPath){
    if (!fs.existsSync(layoutPath)) {
        throw new Error(layoutPath + " doesn't exists!");
    }
    if (!fs.existsSync(layoutPath+'/page.html')) {
        throw new Error(layoutPath+"/page.html doesn't exists!");
    }
    if (!fs.existsSync(layoutPath+'/assets')) {
        throw new Error(layoutPath+"/assets doesn't exists!");
    }
}

module.exports = checkLayoutPath;


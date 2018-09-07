const fs = require('fs');

/**
 * Check rootDir option
 * @param {string} rootDir 
 */
function checkOutputDir(outputDir){
    if (fs.existsSync(outputDir)) {
        throw new Error(outputDir + " already exists!");
    }
}

module.exports = checkOutputDir;


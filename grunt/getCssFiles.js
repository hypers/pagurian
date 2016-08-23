/**
 * Created by Godfery on 2016/8/23 0023.
 */
var fs = require('fs');
var path = require('path');

function getCssFiles(cssPath) {
    var cssObject = {};
    var pathConfig = {
        'themes': cssPath + 'less/themes',
        'pages': [cssPath, 'less/pages'].join(''),
        'output': [cssPath, 'css'].join('')
    };

    fs.readdirSync(pathConfig.themes).forEach(function (fileName) {
        var baseName = path.basename(fileName, path.extname(fileName));
        cssObject[path.normalize(cssPath + 'css/themes-' + baseName + '.css')] = [pathConfig.themes, fileName].join('/');
    });

    fs.readdirSync(pathConfig.pages).forEach(function (fileName) {
        var baseName = path.basename(fileName, path.extname(fileName));
        cssObject[path.normalize(cssPath + 'css/page-' + baseName + '.css')] = [pathConfig.pages, fileName].join('/');
    });

    return cssObject;
}

module.exports = getCssFiles;

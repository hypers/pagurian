/**
 * Created by Godfery on 2016/8/23 0023.
 */
const fs = require('fs');
const path = require('path');

function getCssFiles(cssPath) {
    const cssObject = {};
    const pathConfig = {
        'themes': cssPath + 'less/theme',
        'pages': [cssPath, 'less/pages'].join(''),
        'output': [cssPath, 'css'].join('')
    };

    fs.readdirSync(pathConfig.themes).forEach(function (fileName) {
        const baseName = path.basename(fileName, path.extname(fileName));
        cssObject[path.normalize(cssPath + 'css/themes-' + baseName + '.css')] = [pathConfig.themes, fileName].join('/');
    });

    fs.readdirSync(pathConfig.pages).forEach(function (fileName) {
        const baseName = path.basename(fileName, path.extname(fileName));
        cssObject[path.normalize(cssPath + 'css/page-' + baseName + '.css')] = [pathConfig.pages, fileName].join('/');
    });

    return cssObject;
}

module.exports = getCssFiles;

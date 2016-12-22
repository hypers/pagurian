/**
 * Created by Godfery on 2016/8/23 0023.
 */
const fs = require('fs');
const path = require('path');

function getCssFiles(cssPath) {
    var cssObject = {};
    var pathConfig = {
        'pages': [cssPath, 'less/pages'].join(''),
        'output': [cssPath, 'css'].join('')
    };

    fs.readdirSync(pathConfig.pages).forEach(function (fileName) {
        var baseName = path.basename(fileName, path.extname(fileName));
        //login页面打包到theme中了 所以 不需要在这里执行
        if (baseName === 'login') {
            return;
        }
        cssObject[path.normalize(cssPath + 'css/page-' + baseName + '.css')] = [pathConfig.pages, fileName].join('/');
    });

    return cssObject;
}

module.exports = getCssFiles;

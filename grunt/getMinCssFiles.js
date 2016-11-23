/**
 * Created by Godfery on 2016/11/15.
 */
const fs = require('fs');
const path = require('path');

function getMinCssFiles(resourcesPath, vendorPath) {
    const cssObject = {};
    const cssPath = path.join(resourcesPath, 'css');
    fs.readdirSync(cssPath).forEach((file)=> {
        if(path.extname(file) === '.css'){
            cssObject[path.join(cssPath,file)] =[path.join(cssPath,file)];
        }
    });
    cssObject[cssPath + '/public.css'] = [
        vendorPath + 'bootstrap/css/bootstrap.css',
        vendorPath + 'uniform/css/uniform.default.css',
        vendorPath + 'font-awesome/css/font-awesome.min.css'
    ];
    return cssObject;
}

module.exports = getMinCssFiles;

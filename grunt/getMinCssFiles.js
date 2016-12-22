/**
 * Created by Godfery on 2016/11/15.
 */
const fs = require('fs');
const path = require('path');

function getMinCssFiles(resourcesPath, vendorPath) {
    const cssObject = {};
    const cssPath = path.join(resourcesPath, 'css');
    cssObject[cssPath + '/public.css'] = [
        'bootstrap/css/bootstrap.css',
        'uniform/css/uniform.default.css',
        'font-awesome/css/font-awesome.min.css'
    ].map((path) => vendorPath + path);
    return cssObject;
}

module.exports = getMinCssFiles;

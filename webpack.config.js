
var webpack = require('webpack');
var ignoreFiles = new webpack.IgnorePlugin(/\.\/jquery$/);

module.exports = {
    entry: "./src/modules/com/app.js",
    output: {
        path: __dirname + "/build/modules/com",
        filename: "app.js"
    },
    plugins: [ignoreFiles]
};

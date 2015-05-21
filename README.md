#Pagurian

[ ![Build Status](https://img.shields.io/travis/joyent/node/v0.6.svg) ](http://www.pagurian.com)[ ![tag-1.2.0](https://img.shields.io/badge/tag-v1.2.0-orange.svg) ](https://github.com/hypers/pagurian/tree/v1.2.0)[ ![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat) ](http://mit-license.org/)

一个管理系统的前端解决方案， 致力于让前端设计，开发，测试，发布更简单。

功能简介
--------

[Pagurian](http://www.pagurian.com) 适用于Web管理级的项目

-	基于Sea.js遵循CMD规范，友好的模块定义,使业务开发更简单；
-	集成了Datatable,Echarts等插件，调用方便，提升开发效率；
-	自定义UI色板，构造自己独特色彩的UI。

开发及构建
----------

用户可以在 Pagrian 的基础上进行二次开发

### 目录结构

```
Pagurian
├── [.] .build
├── dist/                   //发布目录
│   ├── lib/
│   ├── modules/
│   ├── plugins/
│   ├── resources/
│   └── templates/
├── docs/                   //开发文档
│   ├── api-datatable.md
│   └── api-*.md
├── [.] node_modules/           //Grunt依赖的NodeJs 模块
├── src/                    //开发目录
│   ├── lib/                //框架依赖的基础库
│   ├── modules/            //业务模块
│   ├── plugins/            //插件模块
│   ├── resources/          //css,images,fonts
│   └── templates/          //handlebars 模版文件
├── test/                   //测试
├── Gruntfile.js
├── package.json
└── pagurian.js
```

### 构建工具

Pagurian 使用 [Grunt](http://gruntjs.com/) 构建项目。

首先全局安装 Grunt

```
npm install -g grunt-cli
```

Clone 项目文件:

```
git clone https://github.com/hypers/pagurian.git
```

然后进入目录安装依赖：

```
npm install
```

接下来，执行 `grunt`：

```
grunt
```

参考、使用的项目
----------------

-	[Sea.js](https://github.com/seajs/seajs) ([MIT License](https://github.com/seajs/seajs/blob/master/LICENSE.md)\)
-	[Handlebars.js](https://github.com/wycats/handlebars.js) ([MIT License](https://github.com/wycats/handlebars.js/blob/master/LICENSE)\)
-	[FontAwesome](https://github.com/FortAwesome/Font-Awesome/) ([CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/)\)
-	[Bootstrap](https://github.com/twbs/bootstrap) ([MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE)\)
-	[bootstrap-datepicker.js](http://www.eyecon.ro/bootstrap-datepicker/) ([Apache License 2.0](http://www.eyecon.ro/bootstrap-datepicker/js/bootstrap-datepicker.js)\)
-	[Datatabls](http://www.datatables.net/)\([MIT License](http://www.datatables.net/license/mit)\)

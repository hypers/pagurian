# Pagurian
[![npm version](https://img.shields.io/npm/v/pagurian.svg) ](https://www.npmjs.com/package/pagurian)
[![Build Status](https://travis-ci.org/hypers/pagurian.svg?branch=dev) ](https://travis-ci.org/hypers/pagurian)
[![devDependency Status](https://david-dm.org/hypers/pagurian/dev-status.svg) ](https://david-dm.org/hypers/pagurian#info=devDependencies)
[![License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat) ](http://mit-license.org/)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)



一个管理系统的前端框架

[Pagurian](http://pagurian.com)早期是[Hypers](http://www.hypers.com)前端团队为 服务于公司的产品搭建的一套前端框架， 已经在多个产品中使用，逐渐成熟，并开源出来。

![Pagurian](/src/resources/img/demo.png)

## 快速开始
以下是一段演示代码，页面引入一个 `pagurian.js` 文件，然后载入 `modules/user/app` 模块, 最后初始化改模块下 `index` 页面的内容。

```html
<script src="pagurian.js" ></script>
<script type="text/javascript">
    pagurian.call("modules/user/app",function(app) {
        app.page.index();
    });
</script>
```

## 开发及构建
开发者可以在 Pagrian 的基础上进行二次开发, Pagurian由[Grunt](http://gruntjs.com/)构建及发布, 你需要安装Grunt以及所依赖的[Node.js](http://www.nodejs.org)环境。

首先安装 Grunt

```
npm install -g grunt-cli
```

Clone 项目文件:

```
git clone https://github.com/hypers/pagurian.git
```

安装grunt插件:

```
cd pagurian
npm install
```

接下来，执行 `grunt`：

```
grunt
```

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
│   ├── plugins/            //插件
│   ├── widgets/            //组件
│   ├── resources/          //css,images,fonts
│   └── templates/          //handlebars 模版文件
├── test/                   //测试
├── Gruntfile.js
├── package.json
└── pagurian.js
```

## 谁在用？
- [Hyper Analytics](https://analytics.hypers.com.cn)
- [Hyper Adstracker](http://adstracker.hypers.com.cn/)

## 参考、使用的项目
- [Sea.js v2.2.1](https://github.com/seajs/seajs) ([MIT License](https://github.com/seajs/seajs/blob/master/LICENSE.md))
- [FontAwesome v4.0.1](https://github.com/FortAwesome/Font-Awesome/) ([CC BY 3.0 License](http://creativecommons.org/licenses/by/3.0/))
- [Bootstrap v3.0.3](https://github.com/twbs/bootstrap) ([MIT License](https://github.com/twbs/bootstrap/blob/master/LICENSE))
- [bootstrap-datepicker.js v1.2](http://www.eyecon.ro/bootstrap-datepicker/) ([Apache License 2.0](http://www.eyecon.ro/bootstrap-datepicker/js/bootstrap-datepicker.js))
- [Datatabls v1.9.4](http://www.datatables.net/)([MIT License](http://www.datatables.net/license/mit))
- [Echarts v2.0](http://echarts.baidu.com/)([MIT License](https://github.com/ecomfe/echarts/blob/master/LICENSE.txt))
- [jQuery v1.9.1](http://jquery.com/)([MIT License](https://jquery.org/license/))
- [ion.rangeSlider](https://github.com/IonDen/ion.rangeSlider)
- [ZeroClipboard](https://github.com/zeroclipboard/zeroclipboard)(MIT License)

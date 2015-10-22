 define(function(require, exports, module) {


     var locale = {},
         activeLocale;

     locale.zh_CN = require('./locale/zh_CN');
     locale.en_US = require('./locale/en_US');
     activeLocale = locale[pagurian.language || "zh_CN"];


     module.exports = {

         line: function(options) {

             var rows = options.rows || [];
             var option = {

                 title: {
                     x: "center",
                     y: "20",
                     textStyle: {
                         color: "#999",
                         fontWeight: '100',
                     }
                 },
                 //设置是否每个节点都显示出来
                 calculable: true,
                 tooltip: {
                     trigger: 'axis'
                 },
                 grid: {
                     x: 90,
                     y: 60,
                     x2: 60,
                     y2: 60
                 },
                 legend: {
                     x: 'center',
                     y: "bottom",
                     data: []
                 },
                 xAxis: [{
                     type: 'category',
                     boundaryGap: false,
                     axisLine: {
                         lineStyle: {
                             color: '#CCC'
                         }
                     },
                     splitLine: {
                         show: false,
                         lineStyle: {
                             color: '#DADADA'
                         }
                     },

                     data: []
                 }],
                 yAxis: [{
                     type: 'value',
                     axisLine: {
                         lineStyle: {
                             color: '#CCC'
                         }
                     },
                     splitLine: {
                         lineStyle: {
                             color: 'rgba(240, 240, 240, 0.8)'
                         }
                     },
                     splitArea: {
                         show: true,
                         areaStyle: {
                             color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                         }
                     }

                 }],
                 series: [],
             };

             //初始化数据
             for (var i = 0; i < rows.length; i++) {
                 option.legend.data.push(rows[i].name);
                 var series = {
                     name: rows[i].name,
                     type: 'line',
                     smooth: true,
                     data: rows[i].value,
                     symbol: "emptyCircle",
                     symbolSize: 5,

                 };
                 $.extend(series, rows[i]);
                 option.series.push(series);
             }

             option.xAxis[0].data = options.columns;
             return option;
         },
         pie: function(options) {
             var dataList = options.data || [];
             var option = {
                 title: {
                     x: "center",
                     y: "20",
                     textStyle: {
                         color: "#999",
                         fontWeight: '100',
                     }
                 },
                 tooltip: {
                     trigger: 'item',
                     formatter: "{a} <br/>{b} : {c} ({d}%)"
                 },
                 legend: {
                     x: 'center',
                     y: "bottom",
                     data: []
                 },

                 calculable: false,
                 series: [{
                     name: '',
                     type: 'pie',
                     radius: '60%',
                     minAngle: 3,
                     startAngle: 0,
                     center: ['50%', '50%'],
                     data: []
                 }]
             };

             $.extend(option.series[0], options);
             //初始化数据
             for (var i = 0; i < dataList.length; i++) {
                 option.legend.data.push(dataList[i].name);
             }

             this.option = option;
             return option;
         },
         bar: function(options) {

             var dataList = options.data || [];
             var config = options.config || {};
             var option = {
                 title: {
                     x: "center",
                     y: "20",
                     textStyle: {
                         color: "#999",
                         fontWeight: '100',
                     }
                 },
                 tooltip: {
                     trigger: 'axis',
                     axisPointer: {
                         type: 'shadow'
                     }
                 },
                 toolbox: {
                     show: false
                 },
                 calculable: false,
                 xAxis: [{
                     type: 'category',
                     data: [],
                     boundaryGap: true,
                     axisLine: {
                         lineStyle: {
                             color: '#CCC'
                         }
                     },
                     splitLine: {
                         show: false,
                         lineStyle: {
                             color: '#DADADA'
                         }
                     }
                 }],
                 yAxis: [{
                     name: '',
                     type: 'value',
                     nameTextStyle: {
                         color: '#000'
                     },
                     axisLine: {
                         lineStyle: {
                             color: '#CCC'
                         }
                     },
                     splitLine: {
                         lineStyle: {
                             color: 'rgba(240, 240, 240, 0.8)'
                         }
                     },
                     splitArea: {
                         show: true,
                         areaStyle: {
                             color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
                         }
                     }
                 }],
                 series: [{
                     name: '',
                     type: 'bar',
                     itemStyle: {
                         normal: {
                             borderRadius: 0
                         }
                     },
                     data: []
                 }]
             };


             //初始化数据
             for (var i = 0; i < dataList.length; i++) {
                 option.xAxis[0].data.push(dataList[i].name);
                 option.series[0].data.push(dataList[i].value);
             }
             if (options.name) {
                 option.yAxis[0].name = options.name;
                 option.series[0].name = options.name;
             }

             this.option = option;
             return option;
         },
         map: function(options) {

             var mapType = options.options.mapType || "china";
             var chinaProvince = $p.locale.chinaProvince || {};
             var country = $p.locale.country || {};

             var nameMap = {
                 china: function(locale) {
                     var list = {};
                     if (locale === "zh_CN") {
                         //暂时不处理
                     } else if (locale === "en_US") {
                         for (var key in chinaProvince) {
                             list[chinaProvince[key]] = key;
                         }
                     }
                     return list;
                 },
                 world: function(locale) {
                     var list = {};
                     if (locale === "zh_CN") {
                         list = country;
                     } else if (locale === "en_US") {
                         for (var key in country) {
                             list[key] = key;
                         }
                     }
                     return list;
                 }
             };


             var getProvinceName = function(name) {
                 if (name) {
                     for (var key in chinaProvince) {
                         if (name.indexOf(chinaProvince[key]) >= 0) {
                             return chinaProvince[key];
                         }
                     }
                 }
                 return name;
             };

             var dataList = options.data || [];
             var option = {
                 color: ['#fe8463', '#ffede8'],
                 title: {
                     x: "center",
                     y: "20",
                     textStyle: {
                         color: "#999",
                         fontWeight: '100',
                     }
                 },
                 tooltip: {
                     trigger: 'item',
                     formatter: options.name + "<br/>{b} : {c} {d}"
                 },
                 dataRange: {
                     orient: 'horizontal',
                     min: 0,
                     max: 0,
                     text: [activeLocale.high, activeLocale.low],
                     calculable: false,
                     color: ['#fe8463', '#ffede8'],
                     x: "18",
                     y: "420"
                 },
                 series: [{
                     name: '',
                     type: 'map',
                     mapType: mapType,
                     nameMap: nameMap[mapType](pagurian.language || "zh_CN"),
                     calculable: false,
                     mapLocation: {
                         y: 60
                     },
                     roam: false,
                     itemStyle: {
                         normal: {
                             label: {
                                 show: mapType === "china" ? true : false
                             }
                         },
                         emphasis: {
                             label: {
                                 show: true,
                                 textStyle: {
                                     color: "#fff"
                                 }
                             },
                             areaStyle: {
                                 color: '#d7504b'
                             }
                         }
                     },
                     data: []
                 }]
             };

             //初始化数据
             for (var i = 0; i < dataList.length; i++) {

                 dataList[i].name = getProvinceName(dataList[i].name);
                 option.series[0].data.push(dataList[i]);
                 if (dataList[i].value > option.dataRange.max) {
                     option.dataRange.max = dataList[i].value;
                 }

             }
             option.series[0].name = options.name;
             $.extend(true, option, options.options);

             this.option = option;

             return option;
         }
     };

 });

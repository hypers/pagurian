/*
 * @fileOverview Echarts参数初始化模块
 * @author <a href="http://www.guoxiaoming.com">simon guo</a>
 * @version 0.1
 *
 */

define(function(require, exports, module) {

	module.exports = {

		line: function(opt, type) {


			var dataList = opt.data || [];
			var config = opt.config || {};
			var option = {
				color: ['#fe8463', '#9bca63', '#fad860', '#60c0dd', '#0084c6', '#d7504b', '#c6e579', '#26c0c0', '#f0805a', '#f4e001', '#b5c334'],
				title: {
					x: "center",
					y: "20",
					textStyle: {
						color: "#999",
						fontWeight: '100',
					}
				},
				calculable: false,
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'line',
						lineStyle: {
							color: '#b5b5b5',
							type: 'solid'
						},
						crossStyle: {
							color: '#b5b5b5'
						},
						shadowStyle: {
							color: 'rgba(200,200,200,0.3)'
						}
					}
				},
				grid: {
					x: 60,
					y: 60,
					x2: 50,
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
				series: []

			};

			//初始化数据
			for (var i = 0; i < dataList.length; i++) {
				option.legend.data.push(dataList[i].name);
				var series = {
					name: dataList[i].name,
					type: 'line',
					smooth: config.smooth || true,
					data: dataList[i].value,
					symbol: "emptyCircle",
					symbolSize: opt.symbolSize || 5

				}
				if (config.stack) {
					series.stack = config.stack;
				}


				if (config.showAreaStyle) {
					series.itemStyle = {
						normal: {
							areaStyle: {
								type: 'default',
								color: option.color[i]
							}
						}

					}
				}

				option.series.push(series);
			}
			option.xAxis[0].data = opt.column;
			return option;

		},
		pie: function(opt, type) {
			var dataList = opt.data || [];
			var config = opt.config || {};
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
					center: ['50%', '55%'],
					data: []
				}]
			};

			//初始化数据
			for (var i = 0; i < dataList.length; i++) {
				option.legend.data.push(dataList[i].name);
				option.series[0].data.push(dataList[i]);
			}
			option.series[0].name = config.name;
			return option;
		},
		bar: function(opt) {

			var dataList = opt.data || [];
			var config = opt.config || {};
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
					formatter: "{a} <br/>{b} : {c} ",
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
			if (config.name) {
				option.yAxis[0].name = config.name;
				option.series[0].name = config.name;
			}
			return option;


		},
		map: function(opt) {
			var province_list = ['重庆', '河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽',
				'山东', '新疆', '江苏', '浙江', '江西', '湖北', '广西', '甘肃', '山西', '内蒙古', '陕西', '吉林',
				'福建', '贵州', '广东', '青海', '西藏', '四川', '宁夏', '海南', '台湾', '香港', '澳门'
			];

			function get_province_name(name) {
				if (name) {
					for (var i = 0; i < province_list.length; i++) {
						if (name.indexOf(province_list[i]) >= 0) {
							return province_list[i];
						}
					}
				}
				return name;
			}

			var dataList = opt.data || [];
			var config = opt.config || {};
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
					trigger: 'item'
				},
				dataRange: {
					orient: 'horizontal',
					min: 0,
					max: 5000,
					text: ['高', '低'],
					calculable: false,
					color: ['#fe8463', '#ffede8']
				},
				series: [{
					name: '独立用户数',
					type: 'map',
					roam: true,
					mapType: 'china',
					roam: false, //是否开启缩放功能
					itemStyle: {
						normal: {
							label: {
								show: true
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

				dataList[i].name = get_province_name(dataList[i].name);
				option.series[0].data.push(dataList[i]);
			}

			option.series[0].name = config.name;



			return option;
		}


	}


});

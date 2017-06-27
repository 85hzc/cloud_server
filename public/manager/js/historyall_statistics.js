//处理数据
function formateData(data1) {
	var arr = data1.values;
	var timeArr = [];
	var bytesArr = [];

	for(var i = 0; i < arr.length; i++) {
		bytesArr.push(arr[i].totalBytes);
		timeArr.push(arr[i].time.slice(0, 6));
	}
	
	return {
		timeArr: timeArr,
		bytesArr: bytesArr
	};
}
/*----------------------------------------------------------------*/
var isconnected = true;//是否联网状态
if(isconnected) {
	myajax(8, "get", {}, allBytesCallback);
} else {

	var data = {
		values: [{
			totalBytes: 1001,
			time: "2016-5-21 20:31:00"
		}, {
			totalBytes:200,
			time: "2016-6-21 20:31:00"
		}, {
			totalBytes:100,
			time: "2016-7-21 20:31:00"
		}]
	};
	
	
	allBytesCallback(data);
}



function allBytesCallback(data1) {
	
var data1 = formateData(data1);//处理数据


	require.config({
		paths: {
			echarts: 'echarts/build/dist'
		}
	});

	// 使用
	require(
		[
			'echarts',
			'echarts/chart/line', // 使用柱状图就加载bar模块，按需加载
			'echarts/chart/bar'
		],
		function(ec) {
			// 基于准备好的dom，初始化echarts图表
			var myChart = ec.init(document.getElementsByClassName('table')[0]);

			var option = {
				title: {
					text: '每月转发流量',
					subtext: ''
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['转发字节']
				},
				toolbox: {
					show: true,
					feature: {
						mark: {
							show: true
						},
						dataView: {
							show: true,
							readOnly: false
						},
						magicType: {
							show: true,
							type: ['line', 'bar']
						},
						restore: {
							show: true
						},
						saveAsImage: {
							show: true
						}
					}
				},
				calculable: true,
				xAxis: [{
					type: 'category',
					boundaryGap: false,
					data: data1.timeArr
				}],
				yAxis: [{
					type: 'value',
					axisLabel: {
						formatter: '{value} Byte'
					}
				}],
				series: [{
					name: '转发字节',
					type: 'line',
					data: data1.bytesArr,
					markPoint: {
						data: [{
								type: 'max',
								name: '最大值'
							},
							{
								type: 'min',
								name: '最小值'
							}
						]
					},
					markLine: {
						data: [{
							type: 'average',
							name: '平均值'
						}]
					}
				}]
			};

			// 为echarts对象加载数据 
			myChart.setOption(option);
		}
	);

} //allBytesCallback

/*----------------------------------饼图---------------------------------*/
// 使用
require(
	[
		'echarts',
		'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
	],
	function(ec) {
		// 基于准备好的dom，初始化echarts图表
		var myChart = ec.init(document.getElementsByClassName('table')[1]);
		var idx = 1;
		option = {
			timeline: {
				data: [
					'0', '1', '2',
					'3', '4'

				],
				label: {
					formatter: function(s) {
						return s.slice(0, 7);
					}
				}
			},
			options: [{
					title: {
						text: '浏览器占比变化',
						subtext: ''
					},
					tooltip: {
						trigger: 'item',
						formatter: "{a} <br/>{b} : {c} ({d}%)"
					},
					legend: {
						data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
					},
					toolbox: {
						show: true,
						feature: {
							mark: {
								show: true
							},
							dataView: {
								show: true,
								readOnly: false
							},
							magicType: {
								show: true,
								type: ['pie', 'funnel'],
								option: {
									funnel: {
										x: '25%',
										width: '50%',
										funnelAlign: 'left',
										max: 1700
									}
								}
							},
							restore: {
								show: true
							},
							saveAsImage: {
								show: true
							}
						}
					},
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						center: ['50%', '45%'],
						radius: '50%',
						data: [{
								value: idx * 128 + 80,
								name: '周一'
							},
							{
								value: idx * 64 + 160,
								name: '周二'
							},
							{
								value: idx * 32 + 320,
								name: '周三'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-'
							}
						]
					}]
				},
				{
					series: [{
						name: '浏览器（数据纯属虚构）',
						type: 'pie',
						data: [{
								value: idx * 128 + 80,
								name: 'Chrome1'
							},
							{
								value: idx * 64 + 160,
								name: 'Firefox1'
							},
							{
								value: idx * 32 + 320,
								name: 'Safari1'
							},
							{
								value: idx * 16 + 640,
								name: 'IE9+1'
							},
							{
								value: idx++ * 8 + 1280,
								name: 'IE8-1'
							}
						]
					}]
				} //series结束
			]
		};

		// 为echarts对象加载数据 
		myChart.setOption(option);
	}
);

/*-----------------------------饼图------------------------*/
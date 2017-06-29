//处理数据
function formateData(data1, bytes) {
	var arr = data1.values;
	var timeArr = [];
	var bytesArr = [];

	for(var i = 0; i < arr.length; i++) {
		if(bytes == 1) {
			bytesArr.push(arr[i].totalBytes);
			timeArr.push(arr[i].time.slice(0, 7));
		}
		if(bytes == 2) {
			bytesArr.push(arr[i].num);
			timeArr.push(arr[i].week + "周");
		}

	}

	return {
		timeArr: timeArr,
		bytesArr: bytesArr
	};
}
/*----------------------------------------------------------------*/
var isconnected = false; //是否联网状态
if(isconnected) {
	myajax(8, "get", {}, allBytesCallback);
	myajax(9, "get", {}, allsumCallback);
} else {

	var data = {
		values: [{
			totalBytes: 100100000,
			time: "2016-05-21 20:31:00"
		}, {
			totalBytes: 2000000000,
			time: "2016-06-21 20:31:00"
		}, {
			totalBytes: 1000000000,
			time: "2016-07-21 20:31:00"
		}, {
			totalBytes: 1000000000,
			time: "2016-08-21 20:31:00"
		}]
	};

	var data2 = {
		values: [{
			num: 20,
			week: 21
		}, {
			num: 3,
			week: 25
		}, {
			num: 4,
			week: 23
		}, {
			num: 5,
			week: 24
		}]
	};

	allBytesCallback(data);
	allsumCallback(data2);
	
}

/*----------------------------------流的情况饼图---------------------------------*/



var option1;
var myChart1;
function refreshPie(data){
			option1.title.subtext
		    option1.series.data = [{
						value: data.values.从直播平台获取流的总字节数,
						name: '从直播平台获取流的总字节数'
					},
					{
						value: data.values.P2P转发流的总字节数,
						name: 'P2P转发流的总字节数'
					},
				];
			myChart1.setOption(option);
}
       

		

	
	
require(
	[
		'echarts',
		'echarts/chart/pie' // 使用柱状图就加载bar模块，按需加载
	],
	function(ec) {
			
		// 基于准备好的dom，初始化echarts图表
		var myChart1 = ec.init(document.getElementsByClassName('ptwop')[0]);
		var idx = 1;
 var  option1 = {
		
			title: {
				text: '直播流情况',
				subtext: '直播流的总字节数 : 2000000000000Byte',
				x: 'center',
				subtextStyle: {
            		color: 'orange'          // 副标题文字颜色
        }
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				x: 'left',
				data: ['从直播平台获取流的总字节数', 'P2P转发流的总字节数']
			},

			calculable: true,
			series: [{
			
				itemStyle: {
					normal: {
						label: {
							show: true,
							formatter: '{c} Byte ({d}%)'
						},
						labelLine: {
							show: true
						}
					}
				},
				name: '直播流情况:',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
						value: 335,
						name: '从直播平台获取流的总字节数'
					},
					{
						value: 310,
						name: 'P2P转发流的总字节数'
					},

				]

			}]
		};

		// 为echarts对象加载数据 
		myChart1.setOption(option1);
		

	
	}
);

/*----------------------------------流的情况结束---------------------------------*/

function allBytesCallback(data1) {

	var data1 = formateData(data1, 1); //处理数据

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
				grid: {
					x: 150
				},
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
					//					markPoint: {
					//						data: [{
					//								type: 'max',
					//								name: '最大值'
					//							},
					//							{
					//								type: 'min',
					//								name: '最小值'
					//							}
					//						]
					//					},
					//					markLine: {
					//						data: [{
					//							type: 'average',
					//							name: '平均值'
					//						}]
					//					}
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

/*-----------------------------饼图end------------------------*/

/*-----------------------------每周观众人数------------------------*/
function allsumCallback(data1) {

	var data1 = formateData(data1, 2); //处理数据

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
			var myChart = ec.init(document.getElementsByClassName('table')[2]);

			var option = {
				grid: {
					x: 150
				},
				title: {
					text: '每周观众人数',
					subtext: ''
				},
				tooltip: {
					trigger: 'axis'
				},
				legend: {
					data: ['观众人数']
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
						formatter: '{value}人'
					}
				}],
				series: [{
					name: '观众人数',
					type: 'line',
					data: data1.bytesArr,
					//					markPoint: {
					//						data: [{
					//								type: 'max',
					//								name: '最大值'
					//							},
					//							{
					//								type: 'min',
					//								name: '最小值'
					//							}
					//						]
					//					},
					//					markLine: {
					//						data: [{
					//							type: 'average',
					//							name: '平均值'
					//						}]
					//					}
				}]
			};

			// 为echarts对象加载数据 
			myChart.setOption(option);
		}
	);

} //allsumCallback
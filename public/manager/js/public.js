function backBtn(){
	$(".backBtn").on("click",function(){
		history.back();
	});
}



function setTitleHeader() {
	
	
	//插件
	var addPluginEle =
		'<a href="addPlugin.html" class="selectTitle" target="iframe1">/ 添加插件</a>';
	var pluginVersionEle =
		'<a href="pluginVersion.html" class="selectTitle" target="iframe1">/ 插件版本</a>'+
		'<a href="addPluginVersion.html" class="selectTitle" target="iframe1">/ 添加版本</a>';
	//设备
	var addDevice = 'a href="addDevice.html" class="selectTitle" target="iframe1">/ 添加设备</a>';
	var deviceDetail = 'a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>';
	var deviceDetail = 'a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>'+
                       'a href="addFirmware.html" class="selectTitle" target="iframe1">/ 添加固件</a>';
     
     $(".titleContainer",parent.document).find(".selectTitle").not(":first").remove();
    $(".titleContainer",parent.document).append(addPluginEle);
}
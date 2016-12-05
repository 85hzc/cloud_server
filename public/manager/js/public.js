backBtn();
setTitleHeader();
//bigBackBtn();//设置大返回按钮



function backBtn(){
	$(".backBtn").on("click",function(){
		history.back();
		
//		alert("返回");
		//返回后刷新页面
		location.href=document.referrer;
	});
}



function setTitleHeader() {
	
	//插件
	var addPlugin =
		'<a href="addPlugin.html" class="selectTitle" target="iframe1">/ 添加插件</a>';
	var pluginVersion =
		'<a href="pluginVersion.html" class="selectTitle" target="iframe1">/ 插件版本</a>';
	var addPluginVersion =
		'<a href="pluginVersion.html" class="selectTitle" target="iframe1">/ 插件版本</a>'+
		'<a href="addPluginVersion.html" class="selectTitle" target="iframe1">/ 添加版本</a>';
	//设备
	var addDevice = '<a href="addDevice.html" class="selectTitle" target="iframe1">/ 添加设备</a>';
	var deviceDetail = '<a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>';
	var addFirmwareVersion = '<a href="deviceDetail.html" class="selectTitle" target="iframe1">/ 设备详情</a>'+
                       '<a href="addFirmwareVersion.html" class="selectTitle" target="iframe1">/ 添加固件</a>';
     
    var titleJson = {"addPlugin":addPlugin,"pluginVersion":pluginVersion,"addPluginVersion":addPluginVersion,"addDevice":addDevice,"deviceDetail":deviceDetail,"addFirmwareVersion":addFirmwareVersion};
      //删除
     $(".titleContainer",parent.document).find(".selectTitle").not(":first").remove();
    var fileName = $("#fileName").attr("fileNam");
    var titleEle = titleJson[fileName];
//  alert(titleEle);
if(titleEle){
	
     //添加
    $(".titleContainer",parent.document).append(titleEle);
}
   
}


define(function (require, exports, module) {

	//依赖模块
	var sendMsg = require('module_send_msg/send_msg');
	var common = require('module_common/common')
	var variable = require('module_variables/variables');
	var M = require('module_msg/Model');
	var V = require('module_view/view');

	//创建loading
	common.createLoadingDiv();
	
	//检查是否处于登陆状态
	common.checkLogin();

	//获取phonegap官网插件
	M.httpActive({ }, 'POST', variable.HTTP_PORT.GETPHONEGAPPLUGIN_URL, 'json', function (data) {
		V.showPhoneGapPluginList(data.msg);
	});

	//获取部门插件
	M.httpActive({ }, 'POST', variable.HTTP_PORT.OURTEAMPLUGIN_URL, 'json', function (data) {
		V.showTeamPluginList(data.msg);
	});

	//创见项目
	$('#createBtn').click(function(){

		var checkedPlugin = $('input:checked')
			,projectType = $('input[type="radio"]:checked').val()
			,pluginArr = []
			,pluginStr;

		if(projectType === 'android'){
			alert('暂不支持构建android项目');
			return;
		};
		$.each(checkedPlugin, function (index, htmlElement) {
			pluginArr.push($(htmlElement).val());
		});

		pluginStr = pluginArr.join('&');

		//生成项目压缩文件
		M.httpActive({
			pluginNameStr:pluginStr,
			projectType:projectType
		}, 'POST', variable.HTTP_PORT.CREATEPROJECT_URL, 'json', function (data) {
			if(data.code === 0){
				$('#downLoad').removeClass('disabled');
				$('#downLoad').attr('href',variable.IP + data.msg);
			};
		});

	});

	//搜索插件
	$('#pluginSearch').submit(function () {
		var key = $('#searchKey').val();

		M.httpActive({
			keyWord: key
		}, 'POST', variable.HTTP_PORT.SEARCHPLUGIN_URL, 'json', function (data) {
			V.showPhoneGapPluginList(data.msg.phonegapPlugins);
			V.showTeamPluginList(data.msg.teamPlugins);
		});
		return false;
	});
});
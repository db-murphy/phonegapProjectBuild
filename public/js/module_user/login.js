define(function (require, exports, module){

	//依赖模块
	var sendMsg = require('module_send_msg/send_msg');
	var variable = require('module_variables/variables');
	var common = require('module_common/common');
	var M = require('module_msg/Model');

	//创建loading
	common.createLoadingDiv();

	$('form').submit(function(){

		//获取用户名和密码
		var loginMsg = sendMsg.getLoginMsg();

		if(!loginMsg){
			return false;
		};

		//发起登陆请求
		M.httpActive(loginMsg, 'POST', variable.HTTP_PORT.LOGIN_URL, 'json', function (data){
			if(data.code === 0){
				window.location.href = 'html/main.html';
			}else{
				alert(data.msg);
			};
		});

		return false;
	});

});
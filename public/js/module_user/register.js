define(function (require, exports, module){
	
	//依赖模块
	var sendMsg = require('module_send_msg/send_msg');
	var variable = require('module_variables/variables');
	var M = require('module_msg/Model');

	//创建loading
	common.createLoadingDiv();
	
	$('form').submit(function(){

		//组装注册请求参数
		var registerMsg = sendMsg.getRegisterMsg();

		if(!registerMsg){
			return false;
		};

		//发起注册请求
		M.httpActive(registerMsg, 'POST', variable.HTTP_PORT.REGISTER_URL, 'json', function (data){
			if(data.code === 0){
				alert('注册成功');
				window.location.href = '../index.html';
			}else{
				alert(data.msg);
			};
		});

		return false;
	});

});
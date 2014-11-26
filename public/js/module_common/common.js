define(function (require,exports,module){
	//依赖模块
	var variables = require('module_variables/variables.js');
	var utils = require('module_utils/utils.js');

	//封装http请求
	function https (json, httpType, url, dataFormat, fnScc){
		$.ajax({
			type: httpType,
			url: variables.BASE_PATH + url,
			dataType: dataFormat,
			data: json,
			success: function(data){
				hideLoading();
				fnScc&&fnScc(data);
			},
			beforeSend : function(request) {
				var divList = $(".modal-backdrop");
				if (divList.length <= 0) {
					showLoading();
				};
			},
		});
	};

	//检查是否处于登陆状态
	function checkLogin (){
		$.post(variables.BASE_PATH + 'checklogin', { }, function (data){
			if (data.code !== 0) {
				alert(data.msg);
				window.location.href = '../index.html';
			}
		},'json');
	};

	//显示Loading
	function showLoading() {
		$("#loadingModalMes").modal('show');
	}

	//隐藏Loading
	function hideLoading() {
		$("#loadingModalMes").modal('hide');
	}

	//创建Loading的DIV
	function createLoadingDiv(){
		$('body').append(variables.LOADINGHTMLARR.join(''));
	};

	//接口导出
	module.exports = {
		https:https,
		checkLogin:checkLogin,
		createLoadingDiv: createLoadingDiv,
		showLoading: showLoading
	};

});
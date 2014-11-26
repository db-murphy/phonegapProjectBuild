define(function (require,exports,module){

	//组装登陆参数
	function getLoginMsg (){
	 	var userName = $('#userName').val();
		var password = $('#password').val();

		if(userName ==='' || password === ''){
			alert('用户名或密码不能为空');
			return false;
		};

		return {
			userName:userName,
			password:password
		};
	};

	//组装注册参数
	function getRegisterMsg (){
		var requireInput = $('.require')
			,len
			,i;

		for(i=0,len=requireInput.length; i<len; i++){
			if(requireInput.eq(i).val() === ''){
				alert('必填信息不能为空');
				return false;
			};
		};

		var userName = $('#userName').val();
		var password = $('#password').val();
		var name = $('#realName').val();
		var email = $('#eamil').val();

		return {
			userName:userName,
			password:password,
			name:name,
			email:email
		};
	};

	module.exports = {
		getLoginMsg:getLoginMsg,
		getRegisterMsg:getRegisterMsg
	};

});
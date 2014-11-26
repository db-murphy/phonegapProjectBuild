var user = require('../db/model').userModel;

//登录
function login (req, res){
	var reqJson = req.body
		,userName = reqJson.userName
		,password = reqJson.password;

	user.find({userName:userName},function (err, arr){
		if(!arr.length){
			res.status(200).json({
				code:1,
				msg:'用户名不存在'
			});
		}else{
			if(arr[0].password == password){
				req.session.userName = reqJson.userName;
				res.status(200).json({
					code:0
				});
			}else{
				res.status(200).json({
					code:4,
					msg:'用户名或密码错误'
				});
			};
		};
	});
};

//注册
function register (req, res){
	var reqJson = req.body
		,userName = reqJson.userName
		,password = reqJson.password
		,name = reqJson.name
		,email = reqJson.email

	user.find({userName:userName},function (err, arr){
		if(arr.length){
			res.status(200).json({
				code:2,
				msg:'用户名已存在'
			});
		}else{
			var userModel = new user({
				userName: userName,
			    password: password,
			    name: name,
			    email:email
			});

			userModel.save(function (){
				res.status(200).json({
					code:0
				});
			});
		}
	});
};

//验证是否处于登陆状态
function checklogin (req, res){
	var userName = req.session.userName;

	if(!userName){
		res.status(200).json({
	        code:1,
	        msg:'登陆超时'
	    })
	}else{
		res.status(200).json({
	        code:0,
	        msg:userName
	    })
	};
};

module.exports = {
	login: login,
	register: register,
	checklogin: checklogin
};
var plugMan = require('plugman');
var shell = require('shelljs');
var basePath = shell.pwd();
var fs = require('fs');
var model = require('../db/model');
var pluginServer = model.pluginModel;
var cachePlugin = model.cachePhonegapPluginModel;

//定时获取官网插件列表缓存在数据库，一天一次
function getPlugin (){
	var cachePluginCount
		,pluginOfPhonegapCount;

	cachePlugin.find(function (err, arr) {
		//缓存下来的插件个数
		cachePluginCount = arr.length;

		//从官网获取插件
		plugMan.search([''], function (err, json) {
			//把取回来的json格式数据转化成数组格式
			var pluginArr = [];
			for(var plugin in json){
				pluginArr.push(json[plugin]);
			};
			pluginOfPhonegapCount = pluginArr.length;

			//如果官网插件个数大于数据库缓存的插件个数，说明应该刷新[1,1,1] [1,1]
			if (pluginOfPhonegapCount > cachePluginCount) {
				for(var i=cachePluginCount; i<pluginOfPhonegapCount; i++){
					//把不是部门发布的插件缓存在本地的官网插件数据库
					(function (index) {
						pluginServer.find({pluginName:pluginArr[index].name}, function (err, arr) {
							if(!arr.length){
								var beSavePluginObj = new cachePlugin({
									pluginName: pluginArr[index].name,
								    description: pluginArr[index].description,
								    version: pluginArr[index].version,
								    time: pluginArr[index].time
								});
								beSavePluginObj.save();
							};
						});
					})(i);
				};
			};
		});
	});
};
getPlugin();
//每天更新一次数据
setInterval(getPlugin,86400000); //(60 * 60 * 24 * 1 * 1000)ms

//从数据库读取官网插件返回给前端
function getPhonegapPlugin (req, res){
	cachePlugin.find(function(err, pluginArr){
		if (err){
			res.status(200).json({
	        	code:1,
	        	msg:'系统内部错误'
	        });
		}else {
	        res.status(200).json({
	        	code:0,
	        	msg:pluginArr
	        });
	    };
	});
};

//获取部门插件
function ourTeamPlugin (req, res){
	pluginServer.find(function(err,arr){
		for(var i=0; i<arr.length; i++){
			arr[i].pluginName = arr[i].pluginName.toLowerCase();
		};

		res.status(200).json({
	    	code:0,
	    	msg:arr
	    });
	});
};

//创建项目
function createProject (req, res){
	var bodyJson = req.body
		,pluginArr = bodyJson.pluginNameStr.split('&')
		,loginName = req.session.userName
		, projectType = bodyJson.projectType;

	//确保插件名字是小写的，因为官网默认是小写
	for(var i=0; i<pluginArr.length; i++){
		pluginArr[i] = pluginArr[i].toLowerCase();
	};

	//如果登录超时
	if(!loginName){
		res.status(200).json({
			code:24,
			msg:'登录超时'
		});
	}else{
		//回到顶级目录
		shell.cd(basePath);

		var documentListArr = shell.ls('./project');
		
		//判断是否有关于此用户的文件夹，如果有就删掉
		if(documentListArr.findThing(loginName)){
			shell.rm('-rf','./project/'+loginName);
			shell.rm('-rf','./public/zip/'+loginName);
		};

		//重新建立关于这个用户的文件夹
		shell.mkdir('-p','project/'+loginName+'/phonegapProject');
		shell.mkdir('-p','./public/zip/'+loginName);

		//创建phonegap项目
		shell.exec('cordova create ./project/'+loginName+'/phonegapProject',function(){

			//进入到此项目文件夹下
			shell.cd('./project/'+loginName+'/phonegapProject');

			//创建ios项目
			shell.exec('cordova platform add '+projectType+'',function(){

				//安装插件
				downLoadPlugin(pluginArr,function(){

					//对项目压缩
					shell.cd(basePath);//回到顶级目录
					shell.cd('./project/'+loginName);
					shell.exec('tar -cvf '+basePath+'/public/zip/'+loginName+'/phonegapProject.zip phonegapProject',function(){
						//回到顶级目录
						shell.cd(basePath);
						res.status(200).json({
							code:0,
							msg:'zip/'+loginName+'/phonegapProject.zip'
						});
					});
					
				});
			});
		});
	};
	
};

//下载安装插件
function downLoadPlugin (arr, fn){
	if(!arr.length){
		fn();
		return;
	};
	var newArr = arr;
	var nowDownLoad = newArr.pop();

	shell.exec('cordova plugin add '+nowDownLoad,function(){
		downLoadPlugin(newArr,fn);
	});
};

//插件发布
function publishPlugin(req, res) {
	//回到顶级目录
	shell.cd(basePath);
	var dirArr = shell.ls('./public/uploadFile');
	var loginName = req.session.userName;
	var userDir = './public/uploadFile/'+loginName+'/';
	var pluginVersion = req.body.version;
	var pluginDescription = req.body.description;

	if(dirArr.findThing(loginName)){
		shell.rm('-rf',userDir);
	};

	shell.mkdir('-p',userDir);

	for(var attr in req.files){
		var fileName = req.files[attr].name;
		var targetPath = userDir + fileName;

		//从压缩包里提取文件名
		var extensionIndex = fileName.lastIndexOf('.');
		var extensionName = fileName.substring(0,extensionIndex);
		extensionName = extensionName.toLowerCase();

		//文件重命名
		fs.renameSync(req.files[attr].path,targetPath);
		shell.cd(userDir);
		shell.exec('tar -xf ' + fileName,function (){

			//发布插件
			plugMan.publish([extensionName], function(arg1, err) {

				//文件操作完毕后回到顶级目录
				shell.cd(basePath);

				if (err) {
		            res.status(200).json({
				        code:1,
				        msg:err
				    })
		        } else {
		        	var timeNow = new Date().getTimeNow();
		        	var savePluginMsg = new pluginServer({
		        		userName: loginName,
    					pluginName: extensionName,
    					description: pluginDescription,
						version: pluginVersion,
						time: timeNow
		        	});

		        	savePluginMsg.save(function (err, result){
		        		if(err){
		        			console.log('save fail');
		        			res.status(200).json({
						        code:1
						    })
		        		}else{
		        			console.log('save sucess');
		        			res.status(200).json({
						        code:0
						    })
		        		};
		        	});
		        };
			});
		});
	};	
};

module.exports = {
	getPhonegapPlugin:getPhonegapPlugin,
	ourTeamPlugin:ourTeamPlugin,
	createProject:createProject,
	publishPlugin:publishPlugin
};
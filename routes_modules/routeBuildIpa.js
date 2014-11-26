var fs = require('fs');
var shell = require('shelljs');
var basePath = shell.pwd();

function buildIpa (req, res){
	//回到顶级目录
	shell.cd(basePath);
	var dirArr = shell.ls('./public/uploadFile');
	var loginName = req.session.userName;
	var userDir = './public/uploadFile/'+loginName+'/';

	if(dirArr.findThing(loginName)){
		shell.rm('-rf',userDir);
		shell.rm('-rf','./public/zip/'+loginName);
	};

	shell.mkdir('-p',userDir);
	shell.mkdir('-p','./public/zip/'+loginName);


	for(var attr in req.files){
		
		var fileName = req.files[attr].name;
		var targetPath = userDir + fileName;
		//从压缩包里提取文件名
		var extensionIndex = fileName.lastIndexOf('.');
		var extensionName = fileName.substring(0,extensionIndex);
		
		//文件重命名
		fs.renameSync(req.files[attr].path,targetPath);

		//进入到当前操作用户目录
		shell.cd(userDir);
		console.log(fileName);
		//解压文件
		shell.exec('tar -xf ' + fileName,function(){

			var ipa_output_path = basePath + '/public/zip/'+loginName;

			//打包ipa
			shell.exec('ipa-build ./'+extensionName+' -o '+ipa_output_path + '/' + extensionName + '.ipa');
			var downloadPath = 'zip/'+loginName+'/'+extensionName+'.ipa';
			//回到顶级目录
			shell.cd(basePath);
			res.status(200).json({
		        code:0,
		        msg:{
		        	downloadPath:downloadPath
		        }
		    })
		});
	};
};

module.exports = {
	buildIpa:buildIpa
};
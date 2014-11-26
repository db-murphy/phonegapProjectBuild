define(function (require, exports, module) {
	//依赖模块
	var sendMsg = require('module_send_msg/send_msg');
	var common = require('module_common/common')
	var variable = require('module_variables/variables');

    //创建loading
    common.createLoadingDiv();
    
	//检查是否处于登陆状态
	common.checkLogin();

	$('form').submit(function(){
		var fileArr = document.getElementById('fileToUpload').files;
		var version = $('#pluginVersion').val();
        var description = $('#pluginDescription').val();

		if(!fileArr.length){
			alert('请选择你要发布的插件');
			return false;
		};

		if(version === '' || description === ''){
			alert('必填信息不能为空');
			return false;
		};

        var file = fileArr[0];
        uploadFile(file);
		return false;
	});

    function uploadFile(file) {

        var fd = new FormData();
        var xhr = new XMLHttpRequest();
        var fileInput = document.getElementById('fileToUpload');

        for(var i=0; i<fileInput.files.length; i++){
        	var file_name = fileInput.files[i].name.split('.')[0];
        	fd.append('pluginName',fileInput.files[i]);
        };
        var version = $('#pluginVersion').val();
        var description = $('#pluginDescription').val();

        fd.append('version',version);
        fd.append('description',description);

        var xhr = new XMLHttpRequest();
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        //xhr.addEventListener("abort", uploadCanceled, false);
        xhr.open("POST", variable.BASE_PATH+"publishPlugin");
        xhr.send(fd);
    }

    function uploadProgress (evt) {
        if (evt.lengthComputable) {
        	var floatNum = evt.loaded / evt.total;
        	console.log(floatNum);
        }
    }

    function uploadComplete (evt) {
    	
        var json = eval('('+evt.target.responseText+')');

        if(json.code === 0){
        	alert('插件发布成功');
        	window.location.href = 'main.html';
        }else{
        	alert('插件发布失败:'+json.msg.code);
        };
    }

    function uploadFailed (evt) {
        alert("上传文件时发生错误");
    }

});
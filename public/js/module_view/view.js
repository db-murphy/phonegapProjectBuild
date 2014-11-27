define(function (require, exports, module) {

	//展示出插件列表
	function showPluginList (data, pluginDomId){

		//先清空内容
		$(pluginDomId).html('');

		if (data.length) {
			var dataJson = {
					pluginName: ''
				}
				,htmlStr = ''
				,pagefn = doT.template($('#pluginListTmpl').text());
			
			for(var i=0; i<data.length; i++){
				dataJson.pluginName = data[i].pluginName;
				htmlStr += pagefn(dataJson);
			};
			$(pluginDomId).html(htmlStr);

		}else{
			$(pluginDomId).html('<div class="alert alert-danger" role="alert">暂无可用插件</div>');
		};
	};

	module.exports = {
		showPluginList:showPluginList
	};
});
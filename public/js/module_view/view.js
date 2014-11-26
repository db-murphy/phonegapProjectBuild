define(function (require, exports, module) {

	//展示出官网插件
	function showPhoneGapPluginList (data){
		if (data.length) {
			var htmlArr = [];

			for(var i=0; i<data.length; i++){
				htmlArr = htmlArr.concat([
					'<div class="checkbox">',
						'<label>',
							'<input type="checkbox" value="'+data[i].pluginName+'">'+data[i].pluginName,
						'</label>',
					'</div>'
				]);
			};
			$('#phonegapPluginList').html(htmlArr.join(''));
		}else{
			$('#phonegapPluginList').html('<div class="alert alert-danger" role="alert">暂无可用插件</div>');
		};
		
	};

	//展示部门插件列表
	function showTeamPluginList (data) {
		if(data.length){
			var htmlArr = [];
			for(var i=0; i<data.length; i++){
				htmlArr = htmlArr.concat([
					'<div class="checkbox">',
						'<label>',
							'<input type="checkbox" value="'+data[i].pluginName+'">'+data[i].pluginName,
						'</label>',
					'</div>'
				]);
			};
			$('#teamPluginList').html(htmlArr.join(''));
		}else{
			$('#teamPluginList').html('<div class="alert alert-danger" role="alert">暂无可用插件</div>');
		};
	}

	module.exports = {
		showPhoneGapPluginList:showPhoneGapPluginList,
		showTeamPluginList:showTeamPluginList
	};
});
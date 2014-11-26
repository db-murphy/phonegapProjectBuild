var model = require('../db/model');
var teamPlugin = model.pluginModel;//部门插件表
var cachePlugin = model.cachePhonegapPluginModel;//官网插件表

function searchPlugin (req, res) {
	var bodyJson = req.body
		,key = bodyJson.keyWord
		,regexp = new RegExp(key,'ig')
		,teamPluginArr = []
		,phoneGapPluginArr = [];

	//查询官网插件
	cachePlugin.find({pluginName: regexp}, function (cacheErr, cachePluginResult) {
		//查询部门插件
		teamPlugin.find({pluginName: regexp}, function (teamErr, teamPluginResult) {
			res.status(200).json({
				code:0,
				msg:{
					phonegapPlugins: cachePluginResult,
					teamPlugins: teamPluginResult
				}
			});
		});
	});
};

module.exports = {
	searchPlugin: searchPlugin
};
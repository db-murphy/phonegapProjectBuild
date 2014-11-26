var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//用户model
var userSchema = new Schema({
    userName: String,
    password: String,
    name: String,
    eamil:String
});
var userModel = mongoose.model('userForm', userSchema);

//部门插件model
var teamPluginSchema = new Schema({
    userName: String,
    pluginName: String,
    description: String,
	version: String,
	time: String
});
var pluginModel = mongoose.model('pluginForm', teamPluginSchema);

//缓存官网插件model
var phonegapPluginModel = new Schema({
	pluginName: String,
    description: String,
    version: String,
    time: String
});
var cachePhonegapPluginModel = mongoose.model('cachePhonegapPlugin', phonegapPluginModel);

module.exports = {
	userModel:userModel,
	pluginModel:pluginModel,
    cachePhonegapPluginModel:cachePhonegapPluginModel
};
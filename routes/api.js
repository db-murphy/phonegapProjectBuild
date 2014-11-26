var express = require('express');
var router = express.Router();
var multipart = require('connect-multiparty');
var upload = new multipart();

var userRequest = require('../routes_modules/routeUser');
var pluginRequest = require('../routes_modules/routePlugin');
var buildApiRequest = require('../routes_modules/routeBuildIpa');
var searchPluginRequest = require('../routes_modules/routeSearchPlugin');

//检查登陆是否超时
router.post('/checklogin',function (req, res) {
	userRequest.checklogin(req, res);
});

//登陆
router.post('/login', function (req, res) {
	userRequest.login(req, res);
});

//注册
router.post('/register', function (req, res) {
	userRequest.register(req, res);
});

//获取phonegap插件
router.post('/getPhonegapPlugin', function (req, res) {
	pluginRequest.getPhonegapPlugin(req, res);
});

//获取部门插件
router.post('/ourTeamPlugin', function (req, res) {
	pluginRequest.ourTeamPlugin(req, res);
});

//生成项目
router.post('/createProject', function (req, res) {
	pluginRequest.createProject(req, res);
});

//发布插件
router.post('/publishPlugin',function (req, res) {
	pluginRequest.publishPlugin(req, res);
});

//打包项目
router.post('/build',upload,function (req, res) {
	buildApiRequest.buildIpa(req, res);
});

//搜索插件
router.post('/searchPlugin', function (req, res) {
	searchPluginRequest.searchPlugin(req, res);
});

module.exports = router;
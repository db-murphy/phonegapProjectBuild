cordova.define("com.appexchangechannel.appexchangesdk.AppExchangeChannelPlugin.AppExchangeChannelPlugin", function(require, exports, module) { function AppExchangeChannelPlugin() {
}

var pluginMethods = [
    "showInterstitial"
];

pluginMethods.forEach(function (pluginMethod) {
	AppExchangeChannelPlugin.prototype[pluginMethod] = function (jsonArg, successCallback, errorCallback) {
		cordova.exec(successCallback, errorCallback, "AppExchangeChannelPlugin", pluginMethod, [jsonArg]);
	};
});

AppExchangeChannelPlugin.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.appexchangechannel = new AppExchangeChannelPlugin();
  return window.plugins.appexchangechannel;
};

cordova.addConstructor(AppExchangeChannelPlugin.install);

});

cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cc.fovea.cordova.purchase/www/store-ios.js",
        "id": "cc.fovea.cordova.purchase.InAppPurchase",
        "clobbers": [
            "store"
        ]
    },
    {
        "file": "plugins/com.appexchangechannel.appexchangesdk.AppExchangeChannelPlugin/www/AppExchangeChannelPlugin.js",
        "id": "com.appexchangechannel.appexchangesdk.AppExchangeChannelPlugin.AppExchangeChannelPlugin",
        "clobbers": [
            "appexchangechannel"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.helloworld": "1.0.0",
    "cc.fovea.cordova.purchase": "3.9.0-beta.3",
    "com.appexchangechannel.appexchangesdk.AppExchangeChannelPlugin": "0.0.9"
}
// BOTTOM OF METADATA
});
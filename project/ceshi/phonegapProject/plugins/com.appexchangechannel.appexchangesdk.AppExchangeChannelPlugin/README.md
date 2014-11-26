## AppExchangeChannelPlugin

A Cordova plugin for using the AppExchangeChannel SDK from a Cordova or Phonegap app.

## Installation

Through Cordova Repo (stable):

    cordova plugin add com.appexchangechannel.appexchangesdk.appexchangechannelplugin

## Example Usage

    For displaying interstitial screens in Javascript:

    window.plugins.appexchangechannel.showInterstitial(null, function () {
        console.log("interstitial done");
    });
    
    For adding apps banner, simply place the following script in you HTML view:
    
    <script id="appexchangesdk" src="http://appexchangechannel.com/js/appexchangesdk.js?p=com.domain.apppackagename"></script>

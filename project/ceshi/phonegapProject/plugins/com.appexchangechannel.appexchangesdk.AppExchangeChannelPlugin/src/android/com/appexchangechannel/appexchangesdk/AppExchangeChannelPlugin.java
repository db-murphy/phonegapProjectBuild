package com.appexchangechannel.appexchangesdk;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class AppExchangeChannelPlugin extends CordovaPlugin {
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		final JSONArray methodArgs = args;
		final CallbackContext callback = callbackContext;
		
		if (action.equals("showInterstitial")) {
			cordova.getThreadPool().execute(new Runnable() {
				public void run() {
                    AppInterstitial.show(cordova.getActivity(), new AppInterstitial.IAppInterstitialCallback() {
                        @Override
                        public void OnComplete() {
                            callback.success(new JSONObject());
                        }
                    });
				}
			});
			return true;
		}
		return false;
	}
}

package com.appexchangechannel.appexchangesdk;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.net.URLDecoder;

public class ReferrerReceiver extends BroadcastReceiver {
    private static final String PREFERENCE_REFERRER = "referrer";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null && intent.getAction() != null && intent.getAction().equals("com.android.vending.INSTALL_REFERRER")) {
            try {
                if (Tools.getPreference(context, PREFERENCE_REFERRER) == null) {
                    String rawReferrer = intent.getStringExtra(PREFERENCE_REFERRER);
                    if (rawReferrer != null) {
                        final String referrer = URLDecoder.decode(rawReferrer, "UTF-8");
                        final Context currentContext = context;
                        ExchangeAPI api = new ExchangeAPI(context);
                        api.trackInstall(referrer, new ExchangeAPI.IApiCallResult() {
                            @Override
                            public void OnApiResult(boolean success) {
                                if (currentContext != null) {
                                    Tools.setPreference(currentContext, PREFERENCE_REFERRER, referrer);
                                    Log.d("com.appexchangechannel.appexchangesdk.ReferrerReceiver", referrer);
                                }
                            }
                        });
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

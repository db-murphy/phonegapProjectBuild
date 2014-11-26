package com.appexchangechannel.appexchangesdk;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.net.Uri;
import android.os.Build;
import android.telephony.TelephonyManager;
import android.util.DisplayMetrics;
import android.view.MotionEvent;
import android.view.View;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.util.Locale;
import java.util.UUID;

public class Tools {

    static public final String PREFERENCES_ID = "com.appexchangechannel.appexchangesdk";
    static public final int APP_ICON_SIZEDP = 60;

    static public String getAppInstanceId(Context context) {
        String appInstanceId;
        File installation = new File(context.getFilesDir(), PREFERENCES_ID);
        try {
            if (!installation.exists()) {
                writeInstallationFile(installation);
            }
            appInstanceId = readInstallationFile(installation);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        return appInstanceId;
    }

    static public String getOSVersion() {
        return Integer.toString(Build.VERSION.SDK_INT);
    }

    static public String getCountryISO(Context context) {
        String countryISO = null;
        TelephonyManager telSrv = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
        if (telSrv != null) {
            countryISO = telSrv.getNetworkCountryIso();
        }
        return countryISO;
    }

    static public String getOSLanguage() {
        return Locale.getDefault().getDisplayLanguage();
    }

    static public String getDeviceName() {
        return Build.DEVICE;
    }

    static public String getPackageName(Context context) {
        return context.getPackageName();
    }

    @SuppressLint("CommitPrefEdits")
    static public void setPreference(Context context, String key, String val) {
        SharedPreferences.Editor editor = context.getSharedPreferences(PREFERENCES_ID, Context.MODE_PRIVATE).edit();
        editor.putString(key, val);
        savePreference(editor);
    }

    static public String getPreference(Context context, String key) {
        return context.getSharedPreferences(PREFERENCES_ID, Context.MODE_PRIVATE).getString(key, null);
    }

    static public boolean displayTouchFeedback(View v, MotionEvent event) {
        if (Build.VERSION.SDK_INT > 11) {
            float alpha = event.getAction() == MotionEvent.ACTION_DOWN ? (float) 0.5 : 1;
            v.setAlpha(alpha);
        }
        return false;
    }

    static public int dpToPx(Context context, int dp) {
        DisplayMetrics displayMetrics = context.getResources().getDisplayMetrics();
        return Math.round(dp * (displayMetrics.xdpi / DisplayMetrics.DENSITY_DEFAULT));
    }

    static public void openAppInPlayMarket(Context context, String packageName, String referrer) {
        try {
            context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + packageName + "&referrer=" + referrer)));
        } catch (android.content.ActivityNotFoundException anfe) {
            context.startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + packageName + "&referrer=" + referrer)));
        }
    }

    private static void savePreference(SharedPreferences.Editor editor) {
        if (Build.VERSION.SDK_INT < 9) {
            editor.commit();
        } else {
            editor.apply();
        }
    }

    private static String readInstallationFile(File installation) throws IOException {
        RandomAccessFile f = new RandomAccessFile(installation, "r");
        byte[] bytes = new byte[(int) f.length()];
        f.readFully(bytes);
        f.close();
        return new String(bytes);
    }

    private static void writeInstallationFile(File installation) throws IOException {
        FileOutputStream out = new FileOutputStream(installation);
        String id = UUID.randomUUID().toString();
        out.write(id.getBytes());
        out.close();
    }

    static public int getResourceLayoutId(Activity act, String resName) {
        return getResource(act, "layout", resName);
    }

    static public int getResourceId(Activity act, String resName) {
        return getResource(act, "id", resName);
    }

    static public int getResource(Activity act, String resType, String resName) {
        Resources res = act.getResources();
        return res.getIdentifier(resName, resType, act.getPackageName());
    }
}

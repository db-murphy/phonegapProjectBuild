package com.appexchangechannel.appexchangesdk;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;

import java.net.HttpURLConnection;
import java.net.URL;

public class AppExchange {

    private String mAppstoreid;
    private Bitmap mIcon;
    private String mName;
    private String mUrltostore;
    private String mDisplayUid;
    private IDownloadIconListener mDownloadIconListener;

    public interface IDownloadIconListener {
        public void OnDownloadIcon(Bitmap icon);
    }

    public AppExchange(String appstoreid, String iconUrl, String name, String urltostore, String displayUid) {
        mDisplayUid = displayUid;
        mAppstoreid = appstoreid;
        mName = name;
        mUrltostore = urltostore;
        if (iconUrl != null) {
            new DownloadIconTask().execute(iconUrl);
        }
    }

    public String getDisplayUid() {
        return mDisplayUid;
    }
    public String getAppstoreid() {
        return mAppstoreid;
    }
    public Bitmap getIcon() {
        return mIcon;
    }
    public String getAppName() {
        return mName;
    }
    public String getUrltostore() {
        return mUrltostore;
    }

    public void setDownloadIconListener(IDownloadIconListener listener) {
        mDownloadIconListener = listener;
    }

    private class DownloadIconTask extends AsyncTask<String, Void, Bitmap> {
        @Override
        protected Bitmap doInBackground(String... params) {
            String url = params[0];
            Bitmap image;
            try {
                HttpURLConnection con = (HttpURLConnection) (new URL(url).openConnection());
                con.setDoInput(true);
                con.setInstanceFollowRedirects(true);
                con.connect();
                image = BitmapFactory.decodeStream(con.getInputStream());
                image = Bitmap.createScaledBitmap(image, 144, 144, false);
            } catch (Exception e) {
                e.printStackTrace();
                image = null;
            }
            return image;
        }
        @Override
        protected void onPostExecute(Bitmap bitmap) {
            super.onPostExecute(bitmap);
            AppExchange.this.mIcon = bitmap;
            if (AppExchange.this.mIcon != null && AppExchange.this.mDownloadIconListener != null) {
                AppExchange.this.mDownloadIconListener.OnDownloadIcon(AppExchange.this.mIcon);
            }
        }
    }
}

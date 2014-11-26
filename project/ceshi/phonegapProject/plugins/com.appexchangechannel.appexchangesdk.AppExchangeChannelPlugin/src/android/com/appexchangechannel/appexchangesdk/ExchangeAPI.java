package com.appexchangechannel.appexchangesdk;

import android.content.Context;
import android.os.AsyncTask;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;


public class ExchangeAPI {

    private static final String API_URL = "http://appexchangechannel.com/en/Applications/";
    Context mContext;
    private String mAppinstanceid;
    private String mOSVersion;
    private String mCountryISO;
    private String mOSLanguage;
    private String mDeviceName;
    private String mPackageName;
    private double mRefreshRate = 0;

    public interface IOnGetAppsListener {
        public void OnGetApps(List<AppExchange> apps);
    }

    public interface IApiCallResult {
        public void OnApiResult(boolean success);
    }

    public ExchangeAPI(Context context) {
        mContext = context;
        mAppinstanceid = Tools.getAppInstanceId(mContext);
        mOSVersion = Tools.getOSVersion();
        mCountryISO = Tools.getCountryISO(mContext);
        mOSLanguage = Tools.getOSLanguage();
        mDeviceName = Tools.getDeviceName();
        mPackageName = Tools.getPackageName(mContext);
    }

    public double getRefreshRate() {
        return mRefreshRate;
    }

    public void getApps(int maxCount, IOnGetAppsListener callback) {
        String apiUrl = String.format(
                API_URL + "slider/%s/json/?osversion=%s&country=%s&appinstanceid=%s&language=%s&device=%s&count=%d",
                mPackageName,
                mOSVersion,
                mCountryISO,
                mAppinstanceid,
                mOSLanguage,
                mDeviceName,
                maxCount);
        new GetApps(callback).execute(apiUrl);
    }

    public void trackInstall(String referrer, IApiCallResult callback) {
        String apiUrl = String.format(API_URL + "install/%s", referrer);
        new GenericApiGET(callback).execute(apiUrl);
    }

    public void trackClick(String urlToStore, IApiCallResult callback) {
        new GenericApiGET(callback).execute(urlToStore);
    }

    private class GetApps extends AsyncTask<String, Void, List<AppExchange>> {
        private IOnGetAppsListener mCallback;
        public GetApps(IOnGetAppsListener callback) {
            mCallback = callback;
        }

        @Override
        protected List<AppExchange> doInBackground(String... params) {
            List<AppExchange> result = null;
            String url = params[0];

            HttpClient client = new DefaultHttpClient();
            try {
                HttpUriRequest req = new HttpGet(url);
                req.setHeader("Cache-Control", "no-cache");
                HttpResponse response = client.execute(req);
                if (response.getStatusLine().getStatusCode() == 200) {
                    InputStream inputStream = response.getEntity().getContent();
                    BufferedReader streamReader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
                    StringBuilder responseStrBuilder = new StringBuilder();
                    String inputStr;
                    while ((inputStr = streamReader.readLine()) != null) {
                        responseStrBuilder.append(inputStr);
                    }
                    JSONObject resultObj = new JSONObject(responseStrBuilder.toString());
                    JSONObject configObj = resultObj.getJSONObject("config");
                    ExchangeAPI.this.mRefreshRate = configObj.getDouble("refreshRate");
                    JSONArray apps = resultObj.getJSONArray("applications");
                    result = new LinkedList<AppExchange>();
                    for (int i = 0; i < apps.length(); i++) {
                        JSONObject appjson = apps.getJSONObject(i);
                        result.add(new AppExchange(
                                appjson.getString("appstoreid"),
                                appjson.getString("icon"),
                                appjson.getString("name"),
                                appjson.getString("urltostore"),
                                appjson.getString("displayUid")));
                    }
                }
            } catch (Exception e) {
                result = null;
                e.printStackTrace();
            }

            return result;
        }
        @Override
        protected void onPostExecute(List<AppExchange> appExchanges) {
            super.onPostExecute(appExchanges);
            if (mCallback != null) {
                mCallback.OnGetApps(appExchanges);
            }
        }
    }

    private class GenericApiGET extends AsyncTask<String, Void, Boolean> {
        private IApiCallResult mCallback;
        public GenericApiGET(IApiCallResult callback) {
            mCallback = callback;
        }

        @Override
        protected Boolean doInBackground(String... strings) {
            Boolean result = false;
            String url = strings[0];
            HttpClient client = new DefaultHttpClient();
            try {
                HttpUriRequest req = new HttpGet(url);
                req.setHeader("Cache-Control", "no-cache");
                HttpResponse response = client.execute(req);
                if (response.getStatusLine().getStatusCode() == 200) {
                    result = true;
                }
            } catch (Exception e) {
                result = false;
            }
            return result;
        }

        @Override
        protected void onPostExecute(Boolean aBoolean) {
            super.onPostExecute(aBoolean);
            if (mCallback != null) {
                mCallback.OnApiResult(aBoolean);
            }
        }
    }
}

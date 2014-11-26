package com.appexchangechannel.appexchangesdk;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.ListView;
import android.widget.TextView;

import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class AppInterstitial extends Activity {

    static final int DISMISS_TIMEOUT = 6000;
    static final int appsCount = 7;

    private Context mContext;

    public interface IAppInterstitialCallback {
        public void OnComplete();
    }

    public static IAppInterstitialCallback mCallback;

    public static void show(Context context, IAppInterstitialCallback callback) {
        AppInterstitial.mCallback = callback;
        Intent i = new Intent(context, AppInterstitial.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK
                |Intent.FLAG_ACTIVITY_REORDER_TO_FRONT
                |Intent.FLAG_ACTIVITY_CLEAR_TOP);
        context.startActivity(i);
    }

    public static void show(Context context) {
        AppInterstitial.show(context, null);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        mContext = this;
        super.onCreate(savedInstanceState);
        int layoutId = Tools.getResourceLayoutId((Activity)mContext, "interstitial_layout");
        setContentView(layoutId);

        findViewById(Tools.getResourceId((Activity)mContext, "buttonClose")).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                closeInterstitial();
            }
        });

        ExchangeAPI api = new ExchangeAPI(this);
        api.getApps(appsCount, new ExchangeAPI.IOnGetAppsListener() {
            @Override
            public void OnGetApps(List<AppExchange> apps) {
                if (apps != null && apps.size() > 0) {
                    displayView(apps);
                } else {
                    closeInterstitial();
                }
            }
        });
    }

    private void displayView(final List<AppExchange> apps) {
        findViewById(Tools.getResourceId((Activity)mContext, "progressBar")).setVisibility(View.GONE);
        final ListView listViewApps = (ListView)findViewById(Tools.getResourceId((Activity)mContext, "listViewApps"));
        listViewApps.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                AppExchange app = (AppExchange)adapterView.getItemAtPosition(i);
                if (app.getUrltostore() != null) {
                    new ExchangeAPI(mContext).trackClick(app.getUrltostore(), null);
                }
                Tools.openAppInPlayMarket(mContext, app.getAppstoreid(), app.getDisplayUid());
            }
        });
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                listViewApps.setAdapter(new AppListAdapter(apps));
            }
        });

        Timer timerDismiss = new Timer();
        timerDismiss.schedule(new TimerTask() {
            @Override
            public void run() {
                closeInterstitial();
            }
        }, DISMISS_TIMEOUT);
    }

    private class AppListAdapter extends BaseAdapter {

        private List<AppExchange> mData;

        public AppListAdapter(List<AppExchange> data) {
            mData = data;
        }

        @Override
        public int getCount() {
            return mData.size();
        }

        @Override
        public Object getItem(int i) {
            return mData.get(i);
        }

        @Override
        public long getItemId(int i) {
            return i;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v;
            final Context mContext = parent.getContext();
            if (convertView == null) {
                v = ((LayoutInflater) mContext.getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(
                        Tools.getResourceLayoutId((Activity)mContext, "appitem_list"), null);
            } else {
                v = convertView;
            }

            final AppExchange app = (AppExchange) getItem(position);
            final TextView itemIcon = (TextView)v.findViewById(Tools.getResourceId((Activity)mContext, "textViewItemList"));
            itemIcon.setText(app.getAppName());

            if (app.getIcon() == null) {
                app.setDownloadIconListener(new AppExchange.IDownloadIconListener() {
                    @Override
                    public void OnDownloadIcon(Bitmap icon) {
                        if (icon != null && mContext != null) {
                            Activity currAct = (Activity)mContext;
                            currAct.runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    setAppExchangeTextViewIcon(itemIcon, app);
                                }
                            });
                        }
                    }
                });
            } else {
                setAppExchangeTextViewIcon(itemIcon, app);
            }

            return v;
        }

        private void setAppExchangeTextViewIcon(TextView tv, AppExchange app) {
            Drawable d = new BitmapDrawable(getResources(),
                    Bitmap.createScaledBitmap(app.getIcon(),
                            Tools.dpToPx(AppInterstitial.this, Tools.APP_ICON_SIZEDP),
                            Tools.dpToPx(AppInterstitial.this, Tools.APP_ICON_SIZEDP), true));
            tv.setCompoundDrawablesWithIntrinsicBounds(d, null, null, null);
        }
    }

    private void closeInterstitial() {
        if (mCallback != null) {
            mCallback.OnComplete();
            mCallback = null;
        }
        finish();
    }
}

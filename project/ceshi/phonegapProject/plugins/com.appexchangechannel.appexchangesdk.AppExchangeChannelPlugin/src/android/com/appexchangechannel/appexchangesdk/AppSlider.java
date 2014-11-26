package com.appexchangechannel.appexchangesdk;

import android.app.Activity;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.AdapterView;
import android.widget.BaseAdapter;
import android.widget.GridView;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.LinkedList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class AppSlider extends LinearLayout {

    static final int appsCount = 4;
    Context mContext;
    View mSliderView;
    GridView mGridviewApps;
    Animation mFadeIn;

    public AppSlider(Context context, AttributeSet attrs) {
        super(context, attrs);
        mContext = context;
        mFadeIn = AnimationUtils.loadAnimation(mContext, Tools.getResource((Activity)mContext, "anim", "fadein"));
        LayoutInflater layoutInflater = (LayoutInflater)context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        mSliderView = layoutInflater.inflate(Tools.getResourceLayoutId((Activity)mContext, "apps_layout"), this);
        if (mSliderView != null) {
            try {
                mGridviewApps = (GridView) mSliderView.findViewById(Tools.getResourceId((Activity)mContext, "gridViewApps"));
            } catch (Exception e) {
                mGridviewApps = null;
            }
        }

        // preview in Edit mode
        if (isInEditMode()) {
            if (mGridviewApps != null) {
                List<AppExchange> previewApps = new LinkedList<AppExchange>();
                for (int i = 0; i < appsCount; i++) {
                    previewApps.add(new AppExchange(String.valueOf(i), null, "App", null, null));
                }
                AppsGridAdapter defaultAdapter = new AppsGridAdapter(previewApps);
                mGridviewApps.setAdapter(defaultAdapter);
            }
            return;
        }

        // Runtime Mode
        if (mSliderView != null) {
            mSliderView.setVisibility(GONE);

            final GridView runtimeGridView = mGridviewApps;
            if (runtimeGridView != null) {
                // app click handler
                runtimeGridView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
                    @Override
                    public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                        AppExchange app = (AppExchange)adapterView.getItemAtPosition(i);
                        if (app.getUrltostore() != null) {
                            new ExchangeAPI(mContext).trackClick(app.getUrltostore(), null);
                        }
                        Tools.openAppInPlayMarket(mContext, app.getAppstoreid(), app.getDisplayUid());
                    }
                });
                getApps();
            }
        }
    }

    private void getApps() {
        final ExchangeAPI api = new ExchangeAPI(mContext);
        api.getApps(appsCount, new ExchangeAPI.IOnGetAppsListener() {
            @Override
            public void OnGetApps(final List<AppExchange> apps) {
                // bind gridview with apps
                if (apps != null && apps.size() > 0 && mContext != null) {
                    Activity currentAct = (Activity) mContext;
                    currentAct.runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            if (mGridviewApps != null) {
                                mGridviewApps.setAdapter(new AppsGridAdapter(apps));
                                mSliderView.setVisibility(VISIBLE);
                                mSliderView.startAnimation(mFadeIn);
                            }
                        }
                    });
                }
                int refreshRate = (int)api.getRefreshRate() * 1000;
                if (refreshRate > 0) {
                    Timer timerRefresh = new Timer();
                    timerRefresh.schedule(new TimerTask() {
                        @Override
                        public void run() {
                            getApps();
                        }
                    }, refreshRate);
                }
            }
        });
    }

    private class AppsGridAdapter extends BaseAdapter {

        private List<AppExchange> mData;

        public AppsGridAdapter(List<AppExchange> data) {
            mData = data;
        }

        @Override
        public int getCount() {
            return mData.size();
        }

        @Override
        public Object getItem(int position) {
            return mData.get(position);
        }

        @Override
        public long getItemId(int position) {
            return position;
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            View v;
            if (convertView == null) {
                v = ((LayoutInflater) parent.getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE)).inflate(
                        Tools.getResourceLayoutId((Activity)mContext, "appitem_icon"), null);
            } else {
                v = convertView;
            }

            final AppExchange app = (AppExchange) getItem(position);
            final TextView itemIcon = (TextView)v.findViewById(Tools.getResourceId((Activity)mContext, "textViewItemIcon"));
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
                            Tools.dpToPx(AppSlider.this.mContext, Tools.APP_ICON_SIZEDP),
                            Tools.dpToPx(AppSlider.this.mContext, Tools.APP_ICON_SIZEDP), true));
            tv.setCompoundDrawablesWithIntrinsicBounds(null, d, null, null);
        }
    }
}

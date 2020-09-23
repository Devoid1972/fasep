//package com.murmuration.android.fasep;

//import android.content.Context;

//import java.io.IOException;
//import java.io.InputStream;

//public class WebAppInterface {
//    Context mContext;

    /**
     * Instantiate the interface and set the context
     */
//    WebAppInterface(Context c) {
//        mContext = c;
//    }

    /**
     * Show a toast from the web page
     */
//    @JavascriptInterface
//    public String loadJSONFromAsset() {
//        String json = null;
//        try {
//            InputStream is = getAssets().open("serbiaWithImage.json");
//            int size = is.available();
//            byte[] buffer = new byte[size];
//            is.read(buffer);
//            is.close();
//            json = new String(buffer, "UTF-8");
//        } catch (IOException ex) {
//            ex.printStackTrace();
//            return null;
//        }
//        return json;
//    }
//}
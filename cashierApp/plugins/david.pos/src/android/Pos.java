package freego.david;

import android.Manifest;
import android.content.pm.PackageManager;
import android.app.Activity;
import android.widget.Toast;
import android.annotation.SuppressLint;
import android.util.Base64;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;

import android.util.Log;
import android.os.Handler;
import android.os.Message;
import android.content.res.AssetManager;

import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.PluginResult;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import static java.util.Arrays.copyOfRange;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.Arrays;

/**
 * This class echoes a string called from JavaScript.
 */
public class Pos extends CordovaPlugin {
    private CordovaWebView mWebView;
    private CallbackContext callbackContext; 
    private WXPayWrapper wxpay;
    public static final String CAMERA = Manifest.permission.CAMERA;
    public static final int CAMERA_REQ_CODE = 0;
    public static final int PERMISSION_DENIED_ERROR = 20;
    public static String byteArrayToStr(byte[] byteArray) {
        if (byteArray == null) {
            return null;
        }
        String str = new String(byteArray);
        return str;
    }

    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        mWebView = webView;
        AssetManager assetManager = cordova.getActivity().getApplicationContext().getAssets();
        wxpay = new WXPayWrapper(assetManager);
    }

    private void show(String txt) {
        Toast.makeText(cordova.getActivity().getApplicationContext(), txt, Toast.LENGTH_SHORT).show();
    }

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        this.callbackContext = callbackContext;
        if (action.equals("echo")) {
            String message = args.getString(0);
            this.echo("from java : " + message, callbackContext);
            return true;
        } else if (action.equals("req_pay")) {
            this.req_pay(args, callbackContext);

            return true;
        } else if (action.equals("query_order")) {
            this.query_order(args, callbackContext);
            return true;
        } else if (action.equals("close_order")) {
            this.close_order(args, callbackContext);
            return true;        
        } else if (action.equals("scan_by_camera")) {
            if (cordova.hasPermission(CAMERA)) {
                start_scan();
            } else {
                cordova.requestPermission(this, CAMERA_REQ_CODE, CAMERA);
            }
            // callbackContext.success(); // Thread-safe.         
            return true;
        } else if (action.equals("exit")) {
            getActivity().finish();
            System.exit(0);
            return true;
        }
        return false;
    }

    private void start_scan() {
        cordova.setActivityResultCallback(this);
        cordova.getActivity().runOnUiThread(new Runnable() {
            @Override
            public void run() {

                Context context = cordova.getActivity().getApplicationContext();
                Intent intent = new Intent(context, Scanner.class);
                cordova.getActivity().startActivityForResult(intent, 0);
                // cordova.setActivityResultCallback (self);
                // cordova.startActivityForResult(self, intent, 0);
            }
        });
    }

    public void onRequestPermissionResult(int requestCode, String[] permissions, int[] grantResults)
            throws JSONException {
        for (int r : grantResults) {
            if (r == PackageManager.PERMISSION_DENIED) {
                this.callbackContext
                        .sendPluginResult(new PluginResult(PluginResult.Status.ERROR, PERMISSION_DENIED_ERROR));
                return;
            }
        }
        switch (requestCode) {
        case CAMERA_REQ_CODE:
            start_scan();
            break;
        }
    }

    private void echo(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private void req_pay(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String ret = wxpay.do_micropay(args);
        callbackContext.success(ret);
    }
    private void query_order(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String ret = wxpay.do_orderQuery(args);
        callbackContext.success(ret);
    }
    private void close_order(JSONArray args, CallbackContext callbackContext) throws JSONException {
        String ret = wxpay.do_closeOrder(args);
        callbackContext.success(ret);
    }
    private Activity getActivity() {
        return this.cordova.getActivity();
    }

    private void shortToast(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            Toast.makeText(cordova.getActivity().getApplicationContext(), message, Toast.LENGTH_SHORT).show();
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    private void longToast(String message, CallbackContext callbackContext) {
        if (message != null && message.length() > 0) {
            Toast.makeText(cordova.getActivity().getApplicationContext(), message, Toast.LENGTH_LONG).show();
            callbackContext.success(message);
        } else {
            callbackContext.error("Expected one non-empty string argument.");
        }
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        // show("in onActivityResult");        
        if (data != null) {
            final String qr_code = data.getStringExtra("qr_code");
            final String format = data.getStringExtra("format");
            final String qr_data = String.format("{\\\"ret\\\":0,\\\"qr_code\\\":\\\"%s\\\",\\\"format\\\":\\\"%s\\\"}",
                    qr_code, format);
            switch (requestCode) {
            case 0:
                getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                        mWebView.sendJavascript(String.format("javascript:on_qr(\"%s\");", qr_data));
                    }
                });
                break;

            default:
                break;
            }
        } else {
            final String qr_data = "{\\\"ret\\\":-1}";
            getActivity().runOnUiThread(new Runnable() {
                public void run() {
                    mWebView.sendJavascript(String.format("javascript:on_qr(\"%s\");", qr_data));
                }
            });
        }

    }

}

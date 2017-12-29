package freego.david;

import com.github.wxpay.sdk.WXPay;
import com.google.gson.Gson;
import org.json.JSONArray;
import org.json.JSONException;
import java.util.HashMap;
import java.util.Map;

public class WXPayWrapper {

    public static String do_micropay(JSONArray args) throws JSONException{
        String out_trade_no = args.getString(0);
        String body = args.getString(1);
        String total_fee = args.getString(2);
        String auth_code = args.getString(3);

        MyConfig config = new MyConfig();
        WXPay wxpay = new WXPay(config);

        Map<String, String> data = new HashMap<String, String>();
        data.put("body", body);
        data.put("out_trade_no", out_trade_no);
        data.put("device_info", "");
        data.put("fee_type", "CNY");
        data.put("total_fee", total_fee);
        data.put("sub_mch_id", "1411994302");
        data.put("spbill_create_ip", "123.12.12.123");

        data.put("auth_code", auth_code);
        String ret = "{}";
        try {
            Map<String, String> resp = wxpay.microPay(data);
            System.out.println(resp);
            Gson gson = new Gson();
            ret = gson.toJson(resp);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return ret;
    }

}
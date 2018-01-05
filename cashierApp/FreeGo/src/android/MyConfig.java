package freego.david;

import android.content.res.AssetManager; 
import android.content.res.AssetFileDescriptor; 
import com.github.wxpay.sdk.WXPayConfig;
import java.io.*;


public class MyConfig implements WXPayConfig{

    private byte[] certData;

    public MyConfig(AssetManager assetManager) {
        try{
            AssetFileDescriptor fileDescriptor = assetManager.openFd("apiclient_cert.p12");
            FileInputStream stream = fileDescriptor.createInputStream();
            // String certPath = "./cert/apiclient_cert.p12";
            // File file = new File(certPath);
            // InputStream certStream = new FileInputStream(file);
            this.certData = new byte[(int) fileDescriptor.getLength()];
            stream.read(this.certData);
            stream.close();
        } catch(Exception e){
            e.printStackTrace();
        } finally {
            // close in & out            
        }                
    }

    public String getAppID() {
        return "wxa71182a49ab08050";
    }

    public String getMchID() {
        return "1278305901";
    }

    public String getKey() {
        return "X5i69E6ZxL5ip15By0oUi3Fr8hINscgO";
    }

    public InputStream getCertStream() {
        ByteArrayInputStream certBis = new ByteArrayInputStream(this.certData);
        return certBis;
    }

    public int getHttpConnectTimeoutMs() {
        return 8000;
    }

    public int getHttpReadTimeoutMs() {
        return 10000;
    }
}
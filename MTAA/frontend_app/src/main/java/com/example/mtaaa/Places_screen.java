package com.example.mtaaa;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.os.Bundle;
import android.transition.Fade;
import android.transition.Slide;
import android.transition.Transition;
import android.transition.TransitionManager;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.material.floatingactionbutton.FloatingActionButton;
import com.google.android.material.snackbar.Snackbar;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Places_screen extends AppCompatActivity {

    private static String rJson;
    public void setrJson(String str){
        Places_screen.rJson = str;
    }
    public String getrJson(){
        return Places_screen.rJson;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_placetype_screen);
        getJson(JSONSaved.getUrl()+"/places/type/"+JSONSaved.getPlacetype());
        
        FloatingActionButton fab = findViewById(R.id.fab);
        fab.setOnClickListener(v -> add_place());
        if(JSONSaved.getUser() == 0) {
            fab.setVisibility(View.INVISIBLE);
        }

    }

    public void add_place()
    {
        Intent intent = new Intent(this, Add_place_screen.class);
        startActivity(intent);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    protected void update() {
        TextView top = findViewById(R.id.placeTop);
        top.setText(JSONSaved.getPlacetypeName());
        LinearLayout ln = findViewById(R.id.linear);
        try {
            JSONObject obj = new JSONObject(getrJson());
            if(obj.has("places")){
                JSONArray obj3 = (JSONArray) obj.get("places");
                Log.i("TESTZ", String.valueOf(obj3.length()));
                for (int i = 0; i < obj3.length(); i++) {
                    JSONObject obj4 = obj3.getJSONObject(i);
                    if(obj4.has("name")){
                        View child = getLayoutInflater().inflate(R.layout.place_button,null);
                        TextView label = child.findViewById(R.id.placeName);
                        label.setText(obj4.getString("name"));
                        TextView desc = child.findViewById(R.id.placeDesc);
                        if(obj4.has("shortDescription")){
                            desc.setText(obj4.getString("shortDescription"));
                        }
                        else{
                            desc.setText("");
                        }
                        if(obj4.has("photo")){
                            JSONObject photoobj = obj4.getJSONObject("photo");
                            JSONArray photoarr = photoobj.getJSONArray("data");
                            Log.i("len", String.valueOf(photoarr.length()));
                            try {
                                byte[] bytes = new byte[photoarr.length()];
                                for(int b=0;b<photoarr.length();b++){
                                    bytes[b]=(byte)(((int)photoarr.get(b)) & 0xFF);
                                }
                                byte[] imagedec = Base64.decode(bytes,Base64.DEFAULT);
                                Log.i("photo", String.valueOf(bytes));
                                ImageView img = child.findViewById(R.id.placeImage);
                                Bitmap decodedPhoto = BitmapFactory.decodeByteArray(imagedec,0,imagedec.length);
                                Log.i("photo", String.valueOf(decodedPhoto));
                                try {
                                    img.setImageBitmap(Bitmap.createScaledBitmap(decodedPhoto,700,700,false));
                                }
                                catch (NullPointerException e){
                                    Log.i("photo", String.valueOf(e));
                                }
                            }
                            catch (IllegalArgumentException e){
                                Log.i("photo", String.valueOf(e));
                            }
                        }
                        child.setOnClickListener(v -> {
                            try {
                                openByPlaceid(obj4.getInt("uniqueID"));
                            } catch (JSONException e) {
                                e.printStackTrace();
                            }
                        });
                        ln.addView(child);
                        ConstraintLayout load = findViewById(R.id.loadingPT);
                        Transition transition = new Fade(Fade.MODE_OUT);
                        transition.setDuration(300);
                        transition.addTarget(load);
                        TransitionManager.beginDelayedTransition(findViewById(android.R.id.content),transition);
                        load.setVisibility(View.INVISIBLE);
                    }
                }
            }
        } catch (JSONException e) {
            Log.e("JSONERROR", "unexpected JSON exception", e);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void getJson(String url){
        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.GET, url,
                response -> {
                    setrJson(response);
                    update();
                }, error -> setrJson("Something went wrong!"));
        queue.add(stringRequest);
    }

    public void openByPlaceid(int placeid) {
        JSONSaved.setPlaceid(placeid);
        Intent intent = new Intent(this, Placeid_screen.class);
        startActivity(intent);
    }
}

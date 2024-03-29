package com.example.mtaaa;

import android.annotation.SuppressLint;
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
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class Reviews_screen extends AppCompatActivity {
    private static String rJson;
    public void setrJson(String str){
        Reviews_screen.rJson = str;
    }
    public String getrJson(){
        return Reviews_screen.rJson;
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_review_screen);
        getJson(JSONSaved.getUrl()+"/places/reviews/"+JSONSaved.getPlaceid());
        Button button = findViewById(R.id.writeReview);
        button.setOnClickListener(v -> writereview());



        if(JSONSaved.getUser() == 0) {
            button.setVisibility(View.INVISIBLE);
            button.setEnabled(false);
        }

        if(JSONSaved.getUser() == 0) {
            button.setVisibility(View.INVISIBLE);
            button.setEnabled(false);
        }


    }

    public void writereview() {
        Intent intent = new Intent(this, Write_review_screen.class);
        startActivity(intent);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    protected void update() {
        int admin = JSONSaved.getIsadmin();
        LinearLayout ln = findViewById(R.id.linear);
        try {
            JSONObject obj = new JSONObject(getrJson());
            if(obj.has("reviews")){
                JSONArray obj3 = (JSONArray) obj.get("reviews");
                Log.i("TEST", String.valueOf(obj3.length()));
                for (int i = 0; i < obj3.length(); i++) {
                    JSONObject obj4 = obj3.getJSONObject(i);
                    if(obj4.has("userUsername")){
                        View child = getLayoutInflater().inflate(R.layout.review_instance,null);
                        TextView label = child.findViewById(R.id.reviewUsername);
                        label.setText(obj4.getString("userUsername"));
                        TextView desc = child.findViewById(R.id.reviewText);
                        TextView rating = child.findViewById(R.id.reviewScore);
                        rating.setText("Rating: ");
                        
                        String revID = obj4.getString("reviewID");
                        if(obj4.has("revPhoto")){
                            JSONObject photoobj = obj4.getJSONObject("revPhoto");
                            JSONArray photoarr = photoobj.getJSONArray("data");
                            Log.i("len", String.valueOf(photoarr.length()));
                            try {
                                byte[] bytes = new byte[photoarr.length()];
                                for(int b=0;b<photoarr.length();b++){
                                    bytes[b]=(byte)(((int)photoarr.get(b)) & 0xFF);
                                }
                                byte[] imagedec = Base64.decode(bytes,Base64.DEFAULT);
                                Log.i("photo", String.valueOf(bytes));
                                ImageView img = child.findViewById(R.id.reviewImage);
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
                        Button button2 = child.findViewById(R.id.button_delete_review);
                        button2.setOnClickListener(v -> deletereview(revID));
                        if(admin != 1) {
                            button2.setVisibility(View.INVISIBLE);
                        }
                        
                        if(obj4.has("reviewText")){
                            desc.setText(obj4.getString("reviewText"));
                        }
                        else{
                            desc.setText("");
                        }
                        if(obj4.has("rating")){
                            for (int j = 0; j < obj4.getInt("rating"); j++) {
                                rating.append(new String(Character.toChars(0x2B50)));
                            }
                        }
                        ln.addView(child);
                        ConstraintLayout load = findViewById(R.id.loading);
                        Transition transition = new Fade(Fade.MODE_OUT);
                        transition.setDuration(300);
                        transition.addTarget(load);
                        TransitionManager.beginDelayedTransition(findViewById(android.R.id.content),transition);
                        load.setVisibility(View.INVISIBLE);
                    }
                }
            }
            View divider = getLayoutInflater().inflate(R.layout.empty_end,null);
            ln.addView(divider);
        } catch (JSONException e) {
            Log.e("JSONERROR", "unexpected JSON exception", e);
        }
    }
    
    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public void deletereview(String revID)
    {
        int userid = JSONSaved.getUser();
        String delete_url = JSONSaved.getUrl()+"/places/reviews/delete/" + revID + "/" + userid;

        RequestQueue queue = Volley.newRequestQueue(this);
        StringRequest stringRequest = new StringRequest(Request.Method.DELETE, delete_url,
                response -> {
                    setrJson(response);
                    refresh();
                }, error -> setrJson("Something went wrong!"));
        queue.add(stringRequest);
    }

    public void refresh()
    {
        Toast.makeText(getApplicationContext(),"Successfully deleted",Toast.LENGTH_SHORT).show();
        finish();

        Intent intent = new Intent(this, Reviews_screen.class);
        startActivity(intent);
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
}

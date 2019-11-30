package com.example.arken.util;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RetroClient {
    private static final String BASE_URL = "https://api.dev.arkenstone.ml/";
    private Retrofit retrofit = null;
    private static RetroClient mInstance;

    private RetroClient(){
        if(retrofit == null){
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
    }

    public static synchronized RetroClient getInstance(){
         if(mInstance == null){
             mInstance = new RetroClient();
         }
         return mInstance;
    }

    public APIService getAPIService(){
        return retrofit.create(APIService.class);
    }
}

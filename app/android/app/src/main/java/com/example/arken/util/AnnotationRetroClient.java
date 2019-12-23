package com.example.arken.util;

import com.example.arken.model.Annotation;

import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class AnnotationRetroClient {
    private static final String BASE_URL = "https://anno.arkenstone.ml/";
    private Retrofit retrofit = null;
    private static AnnotationRetroClient mInstance;

    private AnnotationRetroClient(){
        if(retrofit == null){
            retrofit = new Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();
        }
    }

    public static synchronized AnnotationRetroClient getInstance(){
        if(mInstance == null){
            mInstance = new AnnotationRetroClient();
        }
        return mInstance;
    }

    public AnnotationAPIService getAnnotationAPIService(){
        return retrofit.create(AnnotationAPIService.class);
    }
}

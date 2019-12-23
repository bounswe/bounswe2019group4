package com.example.arken.util;

import com.example.arken.model.Annotation;
import com.example.arken.model.ListAnnotations;

import org.json.JSONObject;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;

public interface AnnotationAPIService {

    @Headers({"Content-Type: application/json"})
    @GET("annotations/article/{id}")
    Call<ResponseBody> getAnnotations(@Header("Cookie") String userCookie, @Path("id") String id);

    @Headers({"Content-Type: application/json"})
    @POST("annotations")
    Call<ResponseBody> createAnnotation(@Header("Cookie") String userCookie, @Body JSONObject annotation);

    //pek anlamadım headerları
    @Headers({"Content-Type: application/json"})
    @DELETE("annotations")
    Call<ResponseBody> deleteAnnotation(@Header("Cookie") String userCookie);

    //pek anlamadım headerları
    @Headers({"Content-Type: application/json"})
    @PUT("annotations")
    Call<ResponseBody> updateAnnotation(@Header("Cookie") String userCookie);

    //pek anlamadı headerları
    @Headers({"Content-Type: application/json"})
    @GET("annotations/{id}")
    Call<ResponseBody> getAnnotation(@Header("Cookie") String userCookie, @Path("id") String annotationId);
}

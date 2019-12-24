package com.example.arken.util;

import com.example.arken.model.AnnoCreateRequest;
import com.example.arken.model.Annotation;

import org.json.JSONObject;

import java.util.List;

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

    @Headers({"Content-Type: application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\""})
    @GET("annotations/article/{id}")
    Call<List<AnnoCreateRequest>> getAnnotations(@Header("Cookie") String userCookie, @Path("id") String id);

    @Headers({"Content-Type: application/ld+json; profile=\"http://www.w3.org/ns/anno.jsonld\""})
    @POST("annotations")
    Call<ResponseBody> createAnnotation(@Header("Cookie") String userCookie, @Body AnnoCreateRequest jsonObject);

    //pek anlamadım headerları
    // @Headers({"Content-Type: application/json"})
    @DELETE("annotations")
    Call<ResponseBody> deleteAnnotation(@Header("Cookie") String userCookie,@Header("If-Match") String match);

    //pek anlamadım headerları
    @Headers({"Content-Type: application/ld+json ; profile= http://www.w3.org/ns/anno.jsonld"})
    @PUT("annotations")
    Call<ResponseBody> updateAnnotation(@Header("Cookie") String userCookie, @Body JSONObject jsonObject);

    //pek anlamadı headerları
    @Headers({"Content-Type: application/json"})
    @GET("annotations/{id}")
    Call<Annotation> getAnnotation(@Header("Cookie") String userCookie, @Path("id") String annotationId);
}

package com.example.arken.util;

import com.example.arken.model.Event;
import com.example.arken.model.ListEvent;
import com.example.arken.model.LoginUser;
import com.example.arken.model.SignupUser;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public interface APIService {
    @Headers({"Content-Type: application/json"})
    @POST("auth/signup")
    Call<ResponseBody> signup(
            @Body SignupUser signupUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/login")
    Call<ResponseBody> login(
            @Body LoginUser loginUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/forget-password")
    Call<ResponseBody> forgetPassword(
            @Body String email
    );

    @Headers({"Content-Type: application/json"})
    @GET("events")
    Call<ListEvent> getEvents(@Query("country") String s, @Query("importance") Integer k);

    @Headers({"Content-Type: application/json"})
    @GET("events")
    Call<ListEvent> getEventsAll();

    @Headers({"Content-Type: application/json"})
    @GET("events/{id}")
    Call<Event> getEvent(@Path("id") long k);
}

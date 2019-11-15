package com.example.arken.util;

import com.example.arken.model.Email;
import com.example.arken.model.Event;
import com.example.arken.model.GoogleId;
import com.example.arken.model.GoogleUser;
import com.example.arken.model.ListEvent;
import com.example.arken.model.LoginUser;
import com.example.arken.model.Profile;
import com.example.arken.model.SignupUser;
import com.example.arken.model.tradingEquipment.ListCurrency;

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
    Call<Profile> login(
            @Body LoginUser loginUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/forget-password")
    Call<ResponseBody> forgetPassword(
            @Body Email email
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/google")
    Call<ResponseBody> google(
            @Body GoogleId googleId
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/signup")
    Call<ResponseBody> signupGoogle(
            @Body GoogleUser googleUser
    );

    @Headers({"Content-Type: application/json"})
    @GET("events")
    Call<ListEvent> getEvents(@Query("country") String country, @Query("importance") Integer importance, @Query("page") Integer s, @Query("limit") Integer k);


    @Headers({"Content-Type: application/json"})
    @GET("trading-equipments")
    Call<ListCurrency> getCurrentCurrencyValues();

    @Headers({"Content-Type: application/json"})
    @GET("events/{id}")
    Call<Event> getEvent(@Path("id") long k);

    @Headers({"Content-Type: application/json"})
    @GET("profile/{id}")
    Call<Profile> getProfile(@Path("id") String k);
}

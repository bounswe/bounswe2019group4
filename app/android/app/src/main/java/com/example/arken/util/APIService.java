package com.example.arken.util;

import com.example.arken.model.LoginUser;
import com.example.arken.model.SignupUser;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface APIService {
    @Headers({"Content-Type: application/json"})
    @POST("signup")
    Call<ResponseBody> signup(
            @Body SignupUser signupUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("login")
    Call<ResponseBody> login(
            @Body LoginUser loginUser
    );
}

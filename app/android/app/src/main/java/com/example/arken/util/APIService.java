package com.example.arken.util;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Field;
import retrofit2.http.FormUrlEncoded;
import retrofit2.http.POST;

public interface APIService {
    @FormUrlEncoded
    @POST("signup")
    Call<ResponseBody> signup(
            @Field("name") String name,
            @Field("surname") String surname,
            @Field("email") String email,
            @Field("password") String password,
            @Field("location") String location
    );
    @FormUrlEncoded
    @POST("login")
    Call<ResponseBody> login(
            @Field("email") String email,
            @Field("password") String password
    );
}

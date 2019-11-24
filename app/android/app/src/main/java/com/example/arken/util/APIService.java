package com.example.arken.util;

import com.example.arken.model.Comment;
import com.example.arken.model.Email;
import com.example.arken.model.Event;
import com.example.arken.model.GoogleId;
import com.example.arken.model.GoogleUser;
import com.example.arken.model.ListEvent;
import com.example.arken.model.LoginUser;
import com.example.arken.model.Profile;
import com.example.arken.model.SearchResult;
import com.example.arken.model.SignupUser;
import com.example.arken.model.User;
import com.example.arken.model.tradingEquipment.Currency;
import com.example.arken.model.tradingEquipment.ListCurrency;
import com.example.arken.model.tradingEquipment.Prediction;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
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
    Call<User> login(
            @Body LoginUser loginUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/forget-password")
    Call<ResponseBody> forgetPassword(
            @Body Email email
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/google")
    Call<User> google(
            @Body GoogleId googleId
    );

    @Headers({"Content-Type: application/json"})
    @POST("auth/signup")
    Call<User> signupGoogle(
            @Body GoogleUser googleUser
    );

    @Headers({"Content-Type: application/json"})
    @POST("comments")
    Call<ResponseBody> makeComment(@Header("Cookie") String userCookie,
                                   @Body Comment comment
    );

    @Headers({"Content-Type: application/json"})
    @GET("events")
    Call<ListEvent> getEvents(@Query("country") String country, @Query("importance") Integer importance, @Query("page") Integer s, @Query("limit") Integer k);


    @Headers({"Content-Type: application/json"})
    @GET("trading-equipments")
    Call<ListCurrency> getCurrentCurrencyValues();

    @Headers({"Content-Type: application/json"})
    @GET("trading-equipments/{id}")
    Call<Currency> getCurrency(@Header("Cookie") String cookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @POST("trading-equipments/follow")
    Call<Currency> followCurrency(@Header("Cookie") String cookie, @Query("tEq") String k);

    @Headers({"Content-Type: application/json"})
    @POST("trading-equipments/unfollow")
    Call<Currency> unFollowCurrency(@Header("Cookie") String cookie, @Query("tEq") String k);

    @Headers({"Content-Type: application/json"})
    @GET("events/{id}")
    Call<Event> getEvent(@Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @GET("profile/{id}")
    Call<Profile> getProfile(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @DELETE("comments/event/{id}")
    Call<ResponseBody> deleteEventComment(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @DELETE("comments/trading-equipment/{id}")
    Call<ResponseBody> deleteTEComment(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @GET("search")
    Call<SearchResult> search(@Query("q") String query);

    @Headers({"Content-Type: application/json"})
    @GET("profile/{id}/follow")
    Call<ResponseBody> follow(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @GET("profile/{id}/unfollow")
    Call<ResponseBody> unfollow(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @GET("profile/accept/{id}")
    Call<ResponseBody> accept(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @GET("profile/reject/{id}")
    Call<ResponseBody> reject(@Header("Cookie") String userCookie, @Path("id") String k);

    @Headers({"Content-Type: application/json"})
    @POST("trading-equipments/prediction")
    Call<Currency> predictionCurrency(@Header("Cookie") String cookie, @Body Prediction prediction);
}

package com.example.arken.model.investment

import com.google.gson.annotations.SerializedName

class Account (
    @SerializedName("EUR")
    var eur:Double,
    @SerializedName("TRY")
    var tl:Double,
    @SerializedName("USD")
    var usd:Double,
    @SerializedName("AUD")
    var aud:Double,
    @SerializedName("CNY")
    var cny : Double,
    @SerializedName("HKD")
    var hkd:Double,
    @SerializedName("INR")
    var inr:Double,
    @SerializedName("JPY")
    var jpy:Double ,
    @SerializedName("AED")
    var aed:Double,
    @SerializedName("LTC")
    var ltc:Double,
    @SerializedName("XRP")
    var xrp:Double,
    @SerializedName("ETH")
    var eth:Double,
    @SerializedName("BTC")
    var btc:Double,
    @SerializedName("FB")
    var fb:Double,
    @SerializedName("AMZN")
    var amzn:Double,
    @SerializedName("AAPL")
    var aapl:Double,
    @SerializedName("MSFT")
    var msft:Double,
    @SerializedName("GOOG")
    var goog:Double,
    @SerializedName("_id")
    var id:String,
    @SerializedName("userId")
    var userId:String,
    @SerializedName("__v")
    var version:Int
)
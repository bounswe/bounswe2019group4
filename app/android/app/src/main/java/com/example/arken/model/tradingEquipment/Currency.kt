package com.example.arken.model.tradingEquipment

import com.google.gson.annotations.SerializedName
import java.io.Serializable
import java.util.Observable

data class Currency(
    @SerializedName("following")
    var following: Boolean?,
    @SerializedName("current")
    var current: Current?,
    @SerializedName("values")
    var values: MutableList<CurrencyValue>?,
    @SerializedName("numberOfUps")
    var numberOfUps: Int?,
    @SerializedName("numberOfDowns")
    var numberOfDowns: Int?


) : Serializable, Observable()
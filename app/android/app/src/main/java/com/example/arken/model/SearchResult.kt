package com.example.arken.model

import com.example.arken.model.tradingEquipment.Current
import com.google.gson.annotations.SerializedName

data class SearchResult(
    @SerializedName("events")
    var events: MutableList<Event>?,
    @SerializedName("users")
    var users: MutableList<User>?,
    @SerializedName("trading-equipments")
    var tradingEquipments: MutableList<Current>?,
    @SerializedName("articles")
    var articles: MutableList<Article>?
)

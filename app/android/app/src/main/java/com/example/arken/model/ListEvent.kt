package com.example.arken.model

import com.google.gson.annotations.SerializedName

data class ListEvent(
    @SerializedName("events")
    var events: MutableList<Event>?,
    @SerializedName("totalNumberOfEvents")
    var totalNumberOfEvents: Int?,
    @SerializedName("totalNumberOfPages")
    var totalNumberOfPages: Int?
)
package com.example.arken.model

import com.google.gson.annotations.SerializedName

data class ListEvent(
    @SerializedName("events")
    var events: List<Event>?,
    @SerializedName("totalNumberOfEvents")
    var totalNumberOfEvents: Int?
)
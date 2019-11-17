package com.example.arken.model.tradingEquipment

import com.example.arken.util.adapter.DateTimeAdapter
import com.google.gson.annotations.JsonAdapter
import java.util.Date

class Current(
    var _id: String,
    var from: String,
    var to: String,
    var rate: String,
    @JsonAdapter(DateTimeAdapter::class)
    val Date: Date?,
    var __v: Int
)
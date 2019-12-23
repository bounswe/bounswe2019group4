package com.example.arken.model

import java.io.Serializable

class Portfolio(
    val _id: String?,
    val title:String,
    val definition: String,
    val isPrivate: Boolean,
    var tradingEqs: List<String>?,
    var userId: String?,
    var username: String?,
    var surname:String?
) : Serializable
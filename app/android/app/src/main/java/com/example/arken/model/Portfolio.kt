package com.example.arken.model

import java.io.Serializable

class Portfolio(
    val id: String,
    val title:String,
    val definition: String,
    val isPrivate: Boolean,
    val tradingEq: List<String>
) : Serializable
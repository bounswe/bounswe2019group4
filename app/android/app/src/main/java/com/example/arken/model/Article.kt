package com.example.arken.model

import java.io.Serializable
import java.util.*

class Article (
    val _id: String?,
    val userId: String?,
    val title: String?,
    val text: String?,
    val date: Date?,
    val rateAverage: Double?,
    val numberOfRates: Int?
    ) : Serializable
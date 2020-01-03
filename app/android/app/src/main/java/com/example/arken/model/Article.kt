package com.example.arken.model

import java.io.Serializable
import java.util.Date

class Article (
    val _id: String? = null,
    val rateAverage: Double? = null,
    val numberOfRates: Int? = null,
    val userId: String? = null,
    val date: Date? = null,
    val __v: Int? = null,
    val username: String? = null,
    val usersurname: String? = null,
    val yourRate: Int? = null,
    val title: String? = null,
    val text: String? = null,
    var comments: MutableList<Comment>? = null,
    var imageId:Int = 0
    ) : Serializable
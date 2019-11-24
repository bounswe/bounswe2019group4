package com.example.arken.model

import java.io.Serializable
import java.util.*

class Event(
    val _id: String?,
    val CalendarId: String?,
    val Country: String?,
    val Date: Date?,
    val Event: String?,
    val Source: String?,
    val Actual: String?,
    val Previous: String?,
    val Forecast: String?,
    val Importance: Int?,
    val __v: String?,
    val comments: MutableList<Comment>
) : Serializable
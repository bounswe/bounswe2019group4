package com.example.arken.model

import java.io.Serializable
import java.util.Date

class Notification(
    val _id: String?,
    val userId: String?,
    val text: String?,
    val date: Date?,
    val __v: Int?
) : Serializable
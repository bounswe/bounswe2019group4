package com.example.arken.model

import java.io.Serializable
import java.util.*

class Comment(
    val userId: String?,
    val related: String?,
    val text: String?,
    val date: Date?,
    val about: String?
) : Serializable
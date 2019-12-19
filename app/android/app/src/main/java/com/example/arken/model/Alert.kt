package com.example.arken.model

import java.io.Serializable

class Alert (
    val _id: String? = null,
    val currency: String? = null,
    val rate: Int? = null,
    val compare: String? = null
) : Serializable
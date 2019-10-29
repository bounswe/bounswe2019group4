package com.example.arken.model

import java.io.Serializable

class Profile(
    val _id: String?,
    val isTrader: Boolean?,
    val isPublic: Boolean?,
    val name: String?,
    val surname: String?,
    val email: String?,
    val location: String?,
    val iban: String?,
    val tckn: String?
) : Serializable
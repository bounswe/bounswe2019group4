package com.example.arken.model

import java.io.Serializable

class Profile(
    val user: User?,
    val following: String?,
    val follower: String?,
    val followStatus: String?,
    val followings: MutableList<String>?,
    val followers: MutableList<String>?,
    val followingTradings: MutableList<String>?,
    val articles: MutableList<String>?,
    val portfolios: MutableList<String>?

) : Serializable

class User(
    val _id: String?,
    val isTrader: Boolean?,
    val isPublic: Boolean?,
    val name: String?,
    val surname: String?,
    val email: String?,
    val location: String?,
    val predictionRate: String?,
    val iban: String?,
    val tckn: String?
) : Serializable
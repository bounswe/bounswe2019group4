package com.example.arken.model

import java.io.Serializable

class FollowingPortfolio(
    val PortfolioId :String,
    val userName: String,
    val userSurname: String,
    val userId: String
) : Serializable

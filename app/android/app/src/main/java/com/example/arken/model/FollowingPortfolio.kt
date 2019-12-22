package com.example.arken.model

import java.io.Serializable

class FollowingPortfolio(
    val PortfolioId :String,
    val username: String,
    val surname: String,
    val userId: String
) : Serializable

package com.example.arken.model

import com.google.gson.annotations.SerializedName

class Recommendation (
    @SerializedName("articleRecommends")
    var articles: MutableList<Article>?,
    @SerializedName("userRecommends")
    var users: MutableList<User>?
)
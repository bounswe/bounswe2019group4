package com.example.arken.model

import com.example.arken.model.Annotation
import com.google.gson.annotations.SerializedName

class AnnoCreateRequest (
    @SerializedName("@context")
    var annoContext:String,
    @SerializedName("type")
    var type:String,
    @SerializedName("body")
    var body:Annotation,
    @SerializedName("target")
    var target:String,
    @SerializedName("articleId")
    var articleId:String
)
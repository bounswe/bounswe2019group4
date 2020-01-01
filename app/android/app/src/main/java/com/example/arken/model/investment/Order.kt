package com.example.arken.model.investment

import com.example.arken.model.investment.enums.Compare
import com.example.arken.model.investment.enums.Type

class Order (
    var _id:String?,
    var compare:Compare,
    var userId:String?,
    var type: Type,
    var amount:Double,
    var currency: String,
    var rate:Double,
    var __v:Int?
)
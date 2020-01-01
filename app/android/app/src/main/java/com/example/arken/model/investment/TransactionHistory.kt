package com.example.arken.model.investment

import com.example.arken.model.investment.enums.Type
import java.util.*

class TransactionHistory (
    var profit:Double,
    var _id:String,
    var text:String,
    var userId:String,
    var date:Date,
    var type: Type,
    var amount:Double,
    var currency: String,
    var fromRate:Double,
    var __v:Int
)
package com.example.arken.model.investment

import com.example.arken.model.tradingEquipment.Current

class Investment (
    var histories:MutableList<TransactionHistory>,
    var currentRates:MutableList<Current>,
    var account: Account,
    var totalProfit:Double
)
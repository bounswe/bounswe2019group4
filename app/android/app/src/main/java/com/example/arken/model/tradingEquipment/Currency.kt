package com.example.arken.model.tradingEquipment

import java.time.LocalDateTime

data class Currency(
    var following: Boolean,
    var current: Current,
    var values: List<CurrencyValue>
)
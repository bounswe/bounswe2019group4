package com.example.arken.model.tradingEquipment

import com.google.gson.annotations.SerializedName
import java.io.Serializable

data class ListCurrency(
    @SerializedName("currencies")
    var currencies: MutableList<Current>?
) : Serializable

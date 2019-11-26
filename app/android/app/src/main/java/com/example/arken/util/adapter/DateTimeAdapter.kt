package com.example.arken.util.adapter

import com.google.gson.JsonDeserializationContext
import com.google.gson.JsonDeserializer
import com.google.gson.JsonElement
import java.lang.reflect.Type
import java.text.SimpleDateFormat
import java.util.Date

class DateTimeAdapter : JsonDeserializer<Date> {
    override fun deserialize(
        json: JsonElement,
        typeOfT: Type?,
        context: JsonDeserializationContext?
    ): Date {
        val date = json.asString
        val format = SimpleDateFormat("yyyy-MM-dd HH:mm:ss")

        return format.parse(date)!!
    }
}
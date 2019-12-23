package com.example.arken.model

import org.json.JSONException
import org.json.JSONObject

import java.util.regex.Pattern

class Annotation {
    var id: String? = null
    var annotationText: String? = null
    var articleId: String? = null
    var userId: String? = null
    var username: String? = null
    var surname: String? = null
    var x: Double = 0.toDouble()
    var y: Double = 0.toDouble()
    var w: Double = 0.toDouble()
    var h: Double = 0.toDouble()
    var type: String? = null
    var startIndex: Int? = null
    var finishIndex:Int? = null

    @Throws(JSONException::class)
    fun toJSON(): JSONObject {
        val jo = JSONObject()
        val body = JSONObject()
        val target = JSONObject()
        val selector = JSONObject()
        body.put("value", annotationText)
        body.put("userId", userId)
        body.put("username", username)
        body.put("surname", surname)
        body.put("type", type)
        selector.put("measurement", String.format("xywh=percent:%.3f,%.3f,%.3f,%.3f", x, y, w, h))
        selector.put("startIndex", startIndex)
        selector.put("finishIndex", finishIndex)
        target.put("selector", selector)
        jo.put("body", body)
        jo.put("target", target)
        jo.put("articleId", articleId)
        return jo
    }

    companion object {


        @Throws(JSONException::class)
        internal fun fromJSON(jsonObject: JSONObject): Annotation {
            val ta = Annotation()
            ta.id = jsonObject.getString("id") // burası null olabilir
            ta.annotationText = jsonObject.getJSONObject("body").getString("value")
            ta.userId = jsonObject.getJSONObject("body").getString("userId")
            ta.username = jsonObject.getJSONObject("body").getString("username")
            ta.surname = jsonObject.getJSONObject("body").getString("surname")
            ta.type= jsonObject.getJSONObject("body").getString("type")
            ta.articleId = jsonObject.getString("articleId")
            ta.startIndex = jsonObject.getJSONObject("target").getJSONObject("selector").getInt("startIndex")
            ta.finishIndex = jsonObject.getJSONObject("target").getJSONObject("selector").getInt("finishIndex")
            val measurement =
                jsonObject.getJSONObject("target").getJSONObject("selector").getString("measurement")
            val pat = Pattern.compile("xywh=percent:(.*),(.*),(.*),(.*)")
            val mat = pat.matcher(measurement)
            if (mat.find() == false)
                throw RuntimeException("Invalid selector value")
            ta.x = java.lang.Double.valueOf(mat.group(1)!!)
            ta.y = java.lang.Double.valueOf(mat.group(2)!!)
            ta.w = java.lang.Double.valueOf(mat.group(3)!!)
            ta.h = java.lang.Double.valueOf(mat.group(4)!!)
            return ta
        }
    }
}
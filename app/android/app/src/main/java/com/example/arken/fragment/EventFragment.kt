package com.example.arken.fragment

import android.annotation.SuppressLint
import android.app.usage.UsageEvents
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.tradingEquipment.ListCurrency
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class EventFragment : Fragment() {
    val args: EventFragmentArgs by navArgs()
    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_event, container, false)

        return view
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val event = args.eventToShow
        val eventName: TextView = view.findViewById(R.id.name)
        val source: TextView = view.findViewById(R.id.source)
        val forecast: TextView = view.findViewById(R.id.forecast)
        val actual: TextView = view.findViewById(R.id.actual)
        val previous: TextView = view.findViewById(R.id.previous)
        val country: TextView = view.findViewById(R.id.country)
        val date: TextView = view.findViewById(R.id.date)
        val importanceStar1: ImageView = view.findViewById(R.id.event_star1_imageView)
        val importanceStar2: ImageView = view.findViewById(R.id.event_star2_imageView)
        val importanceStar3: ImageView = view.findViewById(R.id.event_star3_imageView)
        eventName.text = event!!.Event
        source.text = "Source: " + event.Source
        forecast.text = "Forecast: " + event.Forecast
        actual.text = "Actual: " + event.Actual
        previous.text = "Previous: " + event.Previous
        country.text = event.Country
        date.text = event.Date.toString()
        when {
            (event.Importance) == 1 -> {
                importanceStar1.setImageResource(R.drawable.ic_star_full)
                importanceStar2.setImageResource(R.drawable.ic_star_empty)
                importanceStar3.setImageResource(R.drawable.ic_star_empty)
            }
            (event.Importance) == 2 -> {
                importanceStar1.setImageResource(R.drawable.ic_star_full)
                importanceStar2.setImageResource(R.drawable.ic_star_full)
                importanceStar3.setImageResource(R.drawable.ic_star_empty)
            }
            (event.Importance) == 3 -> {
                importanceStar1.setImageResource(R.drawable.ic_star_full)
                importanceStar2.setImageResource(R.drawable.ic_star_full)
                importanceStar3.setImageResource(R.drawable.ic_star_full)
            }
        }

        fragmentManager?.beginTransaction()?.add(R.id.list_comment_fragment, ListCommentFragment.newInstance( event.CalendarId!!, "EVENT"), "commentList")?.commit()

    }
}
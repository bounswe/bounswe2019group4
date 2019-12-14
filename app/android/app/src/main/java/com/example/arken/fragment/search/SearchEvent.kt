package com.example.arken.fragment.search

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Event
import com.example.arken.model.EventWithComment
import com.example.arken.util.EventAdapter
import com.example.arken.util.OnEventClickedListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchEvent : Fragment(), OnEventClickedListener {

    private lateinit var recyclerView: RecyclerView
    private var eventAdapter: EventAdapter? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_event_list, container, false)

        recyclerView = rootView.findViewById(R.id.event_recyclerView)
        if (eventAdapter == null) {
            eventAdapter = EventAdapter(mutableListOf(), this)
        }

        recyclerView.adapter = eventAdapter

        recyclerView.adapter?.notifyDataSetChanged()
        return rootView
    }

    override fun onItemClicked(event: Event) {

        val call: Call<EventWithComment> = RetroClient.getInstance().apiService.getEvent(event.CalendarId)

        call.enqueue(object : Callback<EventWithComment> {
            override fun onResponse(call: Call<EventWithComment>, response: Response<EventWithComment>) {
                if (response.isSuccessful) {
                    recyclerView.hideKeyboard()
                    val act = SearchFragmentDirections.actionSearchFragmentToEventFragment()
                    var evenResponse : EventWithComment =response.body()!!
                    act.eventToShow = evenResponse.event
                    Navigation.findNavController(recyclerView).navigate(act)

                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<EventWithComment>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun setDataset(list: MutableList<Event>) {
        if (eventAdapter == null) {
            eventAdapter = EventAdapter(mutableListOf(), this)
        }
        eventAdapter!!.dataSet = list
        eventAdapter!!.notifyDataSetChanged()
    }
    fun View.hideKeyboard() {
        val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(windowToken, 0)
    }

}
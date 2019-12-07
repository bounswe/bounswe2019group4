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
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Event
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

        val call: Call<Event> = RetroClient.getInstance().apiService.getEvent(event.CalendarId)

        call.enqueue(object : Callback<Event> {
            override fun onResponse(call: Call<Event>, response: Response<Event>) {
                if (response.isSuccessful) { //TODO: Here it clicks and get the response but it shows null in fields
                    recyclerView.hideKeyboard()
                    val act = SearchFragmentDirections.actionSearchFragmentToEventFragment() // HERE THE DIFFERENCE
                    //IS actionSearchFragmentToEventFragment method is not taking an argument compared to others.
                    // The reason is that in event's OnItemClicked method, it gets to the detailed one with
                    // event parameter on action (act.eventToShow = event) (as seen below), not inside the method...
                    act.eventToShow = event
                    Navigation.findNavController(recyclerView).navigate(act)

                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Event>, t: Throwable) {
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
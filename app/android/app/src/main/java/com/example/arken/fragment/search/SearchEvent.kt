package com.example.arken.fragment.search

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.util.OnEventClickedListener
import com.example.arken.util.EventAdapter
import android.content.Context
import android.util.Log
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.fragment.CommentFragment
import com.example.arken.fragment.EventFragment
import com.example.arken.fragment.ListEventFragment
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.ListEvent
import com.example.arken.model.Profile
import com.example.arken.model.User
import com.example.arken.util.CommentAdapter
import com.example.arken.util.RetroClient
import kotlinx.android.synthetic.main.fragment_listevent.*
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchEvent: Fragment(), OnEventClickedListener {

    private lateinit var recyclerView: RecyclerView
    private lateinit var eventAdapter: EventAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_listevent, container, false)

        recyclerView = rootView.findViewById(R.id.recyclerView)

        eventAdapter = EventAdapter(mutableListOf(), this)
        recyclerView.adapter = eventAdapter

        recyclerView.adapter?.notifyDataSetChanged()
        return rootView
    }

    override fun onItemClicked(event: Event) {

        val call: Call<Event> = RetroClient.getInstance().apiService.getEvent(event._id)

        call.enqueue(object : Callback<Event> {
            override fun onResponse(call: Call<Event>, response: Response<Event>) {
                if (response.isSuccessful) {


                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Event>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
    fun setDataset(list: MutableList<Event>){
        eventAdapter.dataSet = list
        eventAdapter.notifyDataSetChanged()
    }

}
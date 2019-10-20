package com.example.arken.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.activity.MainActivity
import com.example.arken.model.Event
import com.example.arken.model.ListEvent
import com.example.arken.util.EventAdapter
import com.example.arken.util.OnItemClickListener
import com.example.arken.util.RetroClient
import com.google.android.gms.tasks.OnCompleteListener
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*


class ListEventFragment : Fragment(), OnItemClickListener {


    private lateinit var currentLayoutManagerType: LayoutManagerType
    private lateinit var recyclerView: RecyclerView
    private lateinit var layoutManager: RecyclerView.LayoutManager
    private lateinit var dataset: MutableList<Event>
    private lateinit var eventAdapter: EventAdapter
    private lateinit var signOutButton: Button

    enum class LayoutManagerType { GRID_LAYOUT_MANAGER, LINEAR_LAYOUT_MANAGER }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)


        initDataset()
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_listevent,
            container, false
        ).apply { tag = TAG }

        recyclerView = rootView.findViewById(R.id.recyclerView)


        layoutManager = LinearLayoutManager(activity)

        currentLayoutManagerType = LayoutManagerType.LINEAR_LAYOUT_MANAGER

        if (savedInstanceState != null) {

            currentLayoutManagerType = savedInstanceState
                .getSerializable(KEY_LAYOUT_MANAGER) as LayoutManagerType
        }
        setRecyclerViewLayoutManager(currentLayoutManagerType)



        eventAdapter = EventAdapter(dataset, this)
        recyclerView.adapter = eventAdapter

        setRecyclerViewLayoutManager(LayoutManagerType.LINEAR_LAYOUT_MANAGER)

        signOutButton = rootView.findViewById(R.id.events_signOut)
        signOutButton.setOnClickListener { view ->
            activity?.let { it1 ->
                MainActivity.getClient().revokeAccess()
                    .addOnCompleteListener(it1, OnCompleteListener<Void> {
                        if (Navigation.findNavController(view).currentDestination?.id == R.id.listEventFragment)
                            Navigation.findNavController(view)
                                .navigate(R.id.action_listEventFragment_to_startFragment)
                    })
            }
        }
        return rootView
    }


    private fun setRecyclerViewLayoutManager(layoutManagerType: LayoutManagerType) {
        var scrollPosition = 0

        // If a layout manager has already been set, get current scroll position.
        if (recyclerView.layoutManager != null) {
            scrollPosition = (recyclerView.layoutManager as LinearLayoutManager)
                .findFirstCompletelyVisibleItemPosition()
        }

        layoutManager = LinearLayoutManager(activity)
        currentLayoutManagerType = LayoutManagerType.LINEAR_LAYOUT_MANAGER


        with(recyclerView) {
            layoutManager = this@ListEventFragment.layoutManager
            scrollToPosition(scrollPosition)
        }

    }

    override fun onSaveInstanceState(savedInstanceState: Bundle) {


        savedInstanceState.putSerializable(KEY_LAYOUT_MANAGER, currentLayoutManagerType)
        super.onSaveInstanceState(savedInstanceState)
    }


    private fun initDataset() {

        val call: Call<ListEvent> = RetroClient.getInstance().apiService.getEventsAll(1, 10)
        dataset = mutableListOf(
            Event(
                "l", "k", "China"
                , Date(), "House Price Index YoY", "i", ",", "l", "i", 2, ","
            ),
            Event(
                "l", "k", "China"
                , Date(), "Loan Prime Rate 5Y", "i", ",", "l", "i", 2, ","
            ),
            Event(
                "l", "k", "China"
                , Date(), "Loan Prime Rate 1Y", "i", ",", "l", "i", 3, ","
            ),
            Event(
                "l", "k", "Canada"
                , Date(), "Federal Election", "i", ",", "l", "i", 3, ","
            ),
            Event(
                "l", "k", "Japan"
                , Date(), "Balance of Trade", "i", ",", "l", "i", 3, ","
            ),
            Event(
                "l", "k", "Japan"
                , Date(), "Exports YoY", "i", ",", "l", "i", 2, ","
            ),
            Event(
                "l", "k", "Japan"
                , Date(), "Imports YoY", "i", ",", "l", "i", 1, ","
            )
        )
        call.enqueue(object : Callback<ListEvent> {
            override fun onResponse(call: Call<ListEvent>, response: Response<ListEvent>) {
                if (response.isSuccessful) {
                    val listEvent: ListEvent? = response.body()
                    // dataset=listEvent!!.events
                    eventAdapter.dataSet = listEvent!!.events!!
                    eventAdapter.totalPages = listEvent.totalNumberOfPages!!
                    eventAdapter.page = 1
                    eventAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ListEvent>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

    }

    override fun onItemClicked(event: Event) {
        val action = ListEventFragmentDirections.actionListEventFragmentToEventFragment()
        action.eventToShow = event
        Navigation.findNavController(recyclerView).navigate(action)
    }

    override fun onResume() {
        super.onResume()
        val call: Call<ListEvent> = RetroClient.getInstance().apiService.getEventsAll(1, 10)
        call.enqueue(object : Callback<ListEvent> {
            override fun onResponse(call: Call<ListEvent>, response: Response<ListEvent>) {
                if (response.isSuccessful) {
                    val listEvent: ListEvent? = response.body()
                    eventAdapter.dataSet = listEvent!!.events!!
                    eventAdapter.totalPages = listEvent.totalNumberOfPages!!
                    eventAdapter.page = 1
                    eventAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ListEvent>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        private val KEY_LAYOUT_MANAGER = "layoutManager"

    }
}




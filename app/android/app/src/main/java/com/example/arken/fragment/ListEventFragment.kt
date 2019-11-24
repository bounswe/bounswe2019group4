package com.example.arken.fragment

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.*
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.Event
import com.example.arken.model.ListEvent
import com.example.arken.util.EventAdapter
import com.example.arken.util.OnEventClickedListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class ListEventFragment : Fragment(), OnEventClickedListener, View.OnClickListener, AdapterView.OnItemSelectedListener {

    private lateinit var countryEditText: EditText
    private lateinit var importanceSpinner: Spinner
    private lateinit var filterButton: Button
    private lateinit var clearButton: Button
    private lateinit var currentLayoutManagerType: LayoutManagerType
    private lateinit var recyclerView: RecyclerView
    private lateinit var layoutManager: RecyclerView.LayoutManager
    private lateinit var dataset: MutableList<Event>
    private lateinit var eventAdapter: EventAdapter
    private lateinit var layout: ConstraintLayout
    private var importance: Int? = 1

    enum class LayoutManagerType { GRID_LAYOUT_MANAGER, LINEAR_LAYOUT_MANAGER }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        initDataset()
        Log.i("ListEventFragment", "onCreate")
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
        countryEditText = rootView.findViewById(R.id.event_list_filter_country_editText)
        importanceSpinner = rootView.findViewById(R.id.importance_spinner)
        filterButton = rootView.findViewById(R.id.event_list_filter_button)
        filterButton.setOnClickListener(this)
        clearButton = rootView.findViewById(R.id.event_list_clear_button)
        clearButton.setOnClickListener(this)
        layoutManager = LinearLayoutManager(activity)
        val imp = arrayOf(1,2,3,"All")

        ArrayAdapter(
            context!!,
            android.R.layout.simple_spinner_item, imp
        ).also { adapter ->
            // Specify the layout to use when the list of choices appears
            adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            // Apply the adapter to the spinner
            importanceSpinner.adapter = adapter
        }

        importanceSpinner.onItemSelectedListener = this

        currentLayoutManagerType = LayoutManagerType.LINEAR_LAYOUT_MANAGER

        layout = rootView.findViewById(R.id.listEventBase)
        layout.setOnClickListener(this)
        if (savedInstanceState != null) {

            currentLayoutManagerType = savedInstanceState
                .getSerializable(KEY_LAYOUT_MANAGER) as LayoutManagerType
        }
        setRecyclerViewLayoutManager(currentLayoutManagerType)



        eventAdapter = EventAdapter(dataset, this)
        recyclerView.adapter = eventAdapter

        setRecyclerViewLayoutManager(LayoutManagerType.LINEAR_LAYOUT_MANAGER)

        Log.i("ListEventFragment", "onCreateView")

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

        Log.i("ListEventFragment", "onSaveInstanceState")

        savedInstanceState.putSerializable(KEY_LAYOUT_MANAGER, currentLayoutManagerType)
        super.onSaveInstanceState(savedInstanceState)
    }


    private fun initDataset() {

        val call: Call<ListEvent> =
            RetroClient.getInstance().apiService.getEvents(null, null, 1, 10)
        dataset = mutableListOf()
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
        val action = ListEventFragmentDirections.actionEventListFragmentToEventFragment()
        action.eventToShow = event
        Navigation.findNavController(recyclerView).navigate(action)
    }

    override fun onNothingSelected(parent: AdapterView<*>?) {
    }

    override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
        if(position!=3) {
            importance = position + 1
        }
        else{
            importance = null
        }
    }


    override fun onClick(view: View) {
        if (view.id != R.id.event_list_filter_country_editText && view.id != R.id.importance_spinner) {
            val inputMethodManager =
                activity!!.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
            inputMethodManager.hideSoftInputFromWindow(view.windowToken, 0)
        }
        if (view.id == R.id.event_list_filter_button) {

            val country = countryEditText.text.toString()

            val call: Call<ListEvent> =
                RetroClient.getInstance().apiService.getEvents(country, importance, 1, 10)

            call.enqueue(object : Callback<ListEvent> {
                override fun onResponse(call: Call<ListEvent>, response: Response<ListEvent>) {
                    if (response.isSuccessful) {
                        val listEvent: ListEvent? = response.body()
                        eventAdapter.dataSet = listEvent!!.events!!
                        eventAdapter.totalPages = listEvent.totalNumberOfPages!!
                        eventAdapter.page = 1
                        eventAdapter.country = country
                        eventAdapter.importance = importance
                        eventAdapter.notifyDataSetChanged()
                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                            .show()
                    }
                }

                override fun onFailure(call: Call<ListEvent>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }

        if (view.id == R.id.event_list_clear_button) {
            initDataset()
        }
    }

    override fun onResume() {

        Log.i("ListEventFragment", "onResume")
        super.onResume()
        val call: Call<ListEvent> =
            RetroClient.getInstance().apiService.getEvents(null, null, 1, 10)
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




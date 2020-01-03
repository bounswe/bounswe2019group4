package com.example.arken.fragment.tEq

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.model.tradingEquipment.ListCurrency
import com.example.arken.util.CurrencyAdapter
import com.example.arken.util.OnCurrentClickListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ListCurrentFragment : Fragment(), OnCurrentClickListener {


    private lateinit var currentLayoutManagerType: LayoutManagerType
    private lateinit var recyclerView: RecyclerView
    private lateinit var layoutManager: RecyclerView.LayoutManager
    private lateinit var dataset: MutableList<Current>
    private lateinit var currentAdapter: CurrencyAdapter


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
            R.layout.fragment_tequipments,
            container, false
        ).apply {
            tag =
                TAG
        }

        recyclerView = rootView.findViewById(R.id.recyclerViewcurrent)


        layoutManager = LinearLayoutManager(activity)

        currentLayoutManagerType =
            LayoutManagerType.LINEAR_LAYOUT_MANAGER

        if (savedInstanceState != null) {

            currentLayoutManagerType = savedInstanceState
                .getSerializable(KEY_LAYOUT_MANAGER) as LayoutManagerType
        }
        setRecyclerViewLayoutManager(currentLayoutManagerType)



        currentAdapter = CurrencyAdapter(dataset, this)
        recyclerView.adapter = currentAdapter

        setRecyclerViewLayoutManager(LayoutManagerType.LINEAR_LAYOUT_MANAGER)


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
        currentLayoutManagerType =
            LayoutManagerType.LINEAR_LAYOUT_MANAGER


        with(recyclerView) {
            layoutManager = this@ListCurrentFragment.layoutManager
            scrollToPosition(scrollPosition)
        }

    }

    override fun onSaveInstanceState(savedInstanceState: Bundle) {


        savedInstanceState.putSerializable(KEY_LAYOUT_MANAGER, currentLayoutManagerType)
        super.onSaveInstanceState(savedInstanceState)
    }


    private fun initDataset() {

        val call: Call<ListCurrency> = RetroClient.getInstance().apiService.currentCurrencyValues
        dataset = mutableListOf()
        call.enqueue(object : Callback<ListCurrency> {
            override fun onResponse(call: Call<ListCurrency>, response: Response<ListCurrency>) {
                if (response.isSuccessful) {
                    val listCurrency: ListCurrency? = response.body()
                    currentAdapter.dataSet = listCurrency!!.currencies!!
                    currentAdapter.notifyDataSetChanged()
                }
            }

            override fun onFailure(call: Call<ListCurrency>, t: Throwable) {
            }
        })

    }

    override fun onItemClicked(code: String) {
        val action =
            ListCurrentFragmentDirections.actionListCurrentFragmentToCurrencyFragment(
                code
            )
        Navigation.findNavController(recyclerView).navigate(action)
    }

    override fun onResume() {
        super.onResume()
        val call: Call<ListCurrency> = RetroClient.getInstance().apiService.currentCurrencyValues
        call.enqueue(object : Callback<ListCurrency> {
            override fun onResponse(call: Call<ListCurrency>, response: Response<ListCurrency>) {
                if (response.isSuccessful) {
                    val listCurrency: ListCurrency? = response.body()
                    currentAdapter.dataSet = listCurrency!!.currencies!!
                    currentAdapter.notifyDataSetChanged()
                }
            }

            override fun onFailure(call: Call<ListCurrency>, t: Throwable) {
            }
        })
    }

    companion object {
        private val TAG = "RecyclerViewFragment"
        private val KEY_LAYOUT_MANAGER = "layoutManager"
    }
}
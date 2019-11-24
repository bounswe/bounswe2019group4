package com.example.arken.fragment.search

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.SearchView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.viewpager.widget.ViewPager
import com.example.arken.R
import com.example.arken.model.*
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.util.RetroClient
import com.example.arken.util.SearchPagerAdapter
import com.google.android.material.tabs.TabLayout
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchFragment: Fragment() {
    private lateinit var viewPager: ViewPager
    private lateinit var pagerAdapter: SearchPagerAdapter
    private lateinit var tabLayout: TabLayout
    private lateinit var searchView: SearchView
    private var userList = mutableListOf<User>()
    private var articleList = mutableListOf<Article>()
    private var eventList = mutableListOf<Event>()
    private var tEList = mutableListOf<Current>()
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_search, container, false)
        viewPager = view.findViewById(R.id.search_viewPager)
        // Get the list of movies from the JSON file
        val values = arrayOf("EVENTS","TRADING EQ","ARTICLE","USER")

        pagerAdapter = fragmentManager?.let { SearchPagerAdapter(it, values) }!!
        viewPager.adapter = pagerAdapter

        tabLayout = view.findViewById(R.id.search_tab_view)
        tabLayout.setupWithViewPager(viewPager)

        searchView = view.findViewById(R.id.search_view)
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String): Boolean {
                // do something on text submit
                return false
            }

            override fun onQueryTextChange(newText: String): Boolean {

                if(newText.trim() != ""){
                    val call: Call<SearchResult> = RetroClient.getInstance().apiService.search(newText)

                    call.enqueue(object : Callback<SearchResult> {
                        override fun onResponse(call: Call<SearchResult>, response: Response<SearchResult>) {
                            if (response.isSuccessful) {
                                userList = response.body()?.users!!
                                articleList = response.body()?.articles!!
                                eventList = response.body()?.events!!
                                tEList = response.body()?.tradingEquipments!!
                                pagerAdapter.setDataset(eventList, tEList, articleList, userList)

                            } else {
                                Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                            }
                        }

                        override fun onFailure(call: Call<SearchResult>, t: Throwable) {
                            Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                        }
                    })
                }
                return false
            }
        })

        return view
    }
}
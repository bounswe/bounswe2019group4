package com.example.arken.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.NonNull
import androidx.annotation.Nullable
import androidx.fragment.app.Fragment
import androidx.viewpager.widget.ViewPager
import com.example.arken.R
import com.example.arken.util.SearchPagerAdapter
import com.google.android.material.tabs.TabLayout

class SearchFragment: Fragment() {
    private lateinit var viewPager: ViewPager
    private lateinit var pagerAdapter: SearchPagerAdapter
    private lateinit var tabLayout: TabLayout
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_search, container, false)
        viewPager = view.findViewById(R.id.search_viewPager)
        // Get the list of movies from the JSON file
        val values = arrayOf("elif1","elif2 ","elif3","elif4")

        pagerAdapter = fragmentManager?.let { SearchPagerAdapter(it, values) }!!
        viewPager.adapter = pagerAdapter

        tabLayout = view.findViewById(R.id.search_tab_view)
        tabLayout.setupWithViewPager(viewPager)

        return view
    }
}
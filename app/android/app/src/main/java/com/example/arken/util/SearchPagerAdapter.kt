package com.example.arken.util

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter
import com.example.arken.fragment.search.SearchArticle
import com.example.arken.fragment.search.SearchTE
import com.example.arken.fragment.search.SearchUser
import com.example.arken.fragment.search.SearchEvent

class SearchPagerAdapter(fragmentManager: FragmentManager, private val values: Array<String>) :
    FragmentStatePagerAdapter(fragmentManager) {

    // 2
    override fun getItem(position: Int): Fragment {
        //to be changed!!!
        if(position == 0){
            //event
            return SearchEvent()
        }
        else if(position == 1){
            //tE
            return SearchTE()
        }
        else if(position == 2){
            //article
            return SearchArticle()
        }
        else{
            return SearchUser()
        }
    }

    // 3
    override fun getCount(): Int {
        return values.size
    }
    override fun getPageTitle(position: Int): CharSequence {
        return values[position]
    }
}
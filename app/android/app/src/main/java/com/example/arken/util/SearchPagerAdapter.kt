package com.example.arken.util

import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentStatePagerAdapter
import com.example.arken.fragment.search.SearchArticle
import com.example.arken.fragment.search.SearchEvent
import com.example.arken.fragment.search.SearchFragment
import com.example.arken.fragment.search.SearchTE
import com.example.arken.fragment.search.SearchUser
import com.example.arken.model.Article
import com.example.arken.model.Event
import com.example.arken.model.User
import com.example.arken.model.tradingEquipment.Current

class SearchPagerAdapter(
    fragmentManager: FragmentManager,
    private val values: Array<String>,
    searchFragment: SearchFragment
) :
    FragmentStatePagerAdapter(fragmentManager) {

    private val event = SearchEvent()
    private val te = SearchTE()
    private val article = SearchArticle()
    private val user = SearchUser(searchFragment)


    val fragmentArr = arrayOf(event, te, article, user)

    // 2
    override fun getItem(position: Int): Fragment {

        return fragmentArr[position]
    }

    // 3
    override fun getCount(): Int {
        return values.size
    }

    override fun getPageTitle(position: Int): CharSequence {
        return values[position]
    }

    fun setDataset(
        mutableListEvent: MutableList<Event>,
        mutableListTE: MutableList<Current>,
        mutableListArticle: MutableList<Article>,
        mutableListUser: MutableList<User>
    ) {
        user.setDataset(mutableListUser)
        event.setDataset(mutableListEvent)
        te.setDataset(mutableListTE)
        //TODO:
        //article.setDataset(mutableListArticle) //Implement after Articles implemented!!!
    }
}
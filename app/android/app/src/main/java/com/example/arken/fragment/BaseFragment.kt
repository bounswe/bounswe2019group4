package com.example.arken.fragment

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import androidx.navigation.Navigation
import androidx.navigation.fragment.NavHostFragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.activity.MainActivity
import com.example.arken.fragment.article.ArticleDetailDirections
import com.example.arken.fragment.article.ListArticleFragmentDirections
import com.example.arken.fragment.event.ListEventFragmentDirections
import com.example.arken.fragment.search.SearchFragmentDirections
import com.example.arken.fragment.signup_login.LoginFragment.MY_PREFS_NAME
import com.example.arken.fragment.tEq.ListCurrentFragmentDirections
import com.example.arken.fragment.portfolio.PortfolioFragmentDirections
import com.example.arken.util.MenuAdapter
import com.example.arken.util.OnMenuItemClickListener
import com.google.android.gms.auth.api.signin.GoogleSignIn

class BaseFragment : Fragment(), OnMenuItemClickListener {

    private var fragment: Fragment? = null
    private var recyclerView: RecyclerView? = null
    private var selected = 0
    private var isLogged = true
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_base, container, false)
        val f = childFragmentManager
        recyclerView = view.findViewById(R.id.menu_recycler)
        val callback = object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                signOutPressed()
            }
        }
        requireActivity().onBackPressedDispatcher.addCallback(this, callback)
        fragment = f.findFragmentById(R.id.nav_host_base_fragment)

        val prefs = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
        val email = prefs.getString("email", "default")
        if (GoogleSignIn.getLastSignedInAccount(context!!) == null && email == "default") {
            isLogged = false
        }

        val imageArr = listOf(
            R.drawable.ic_event,
            R.drawable.ic_trading_eq,
            R.drawable.ic_search,
            R.drawable.ic_event,
            R.drawable.ic_person_white,
            R.drawable.ic_portfolio,
            R.drawable.ic_logout
        )
        val stringArr = arrayOf("Events", "Trading Eq", "Search", "Article", "Profile", "Portfolio", "Log Out")
        val adapter = MenuAdapter(imageArr, stringArr, isLogged, this)

        recyclerView!!.adapter = adapter

        return view
    }

    private fun signOutPressed() {
        if ((findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment || selected == 4) && isLogged) {
            val builder1 = AlertDialog.Builder(context!!)
            builder1.setMessage(R.string.log_out_warning)
            builder1.setCancelable(true)

            builder1.setPositiveButton(
                "Yes"
            ) { dialog, id ->
                dialog.cancel()
                signOut()
            }

            builder1.setNegativeButton(
                "No"
            ) { dialog, id -> dialog.cancel() }

            val alert11 = builder1.create()
            alert11.show()
        } else {
            if (Navigation.findNavController(recyclerView!!).currentDestination!!.id == R.id.baseFragment)
                Navigation.findNavController(recyclerView!!).popBackStack()
        }
    }

    private fun signOut() {
        MainActivity.getClient().signOut().addOnCompleteListener {
            val editor = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit()
            editor.clear()
            editor.apply()
            if (Navigation.findNavController(recyclerView!!).currentDestination!!.id == R.id.baseFragment)
                Navigation.findNavController(recyclerView!!).popBackStack()
        }
    }

    override fun onMenuItemClicked(index: Int) {

        selected = index
        if (index == 0) {
            if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                val recyclerView = fragment!!.view!!.findViewById<RecyclerView>(R.id.recyclerView)
                recyclerView.smoothScrollToPosition(0)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                findNavController(fragment!!).navigate(R.id.action_listCurrentFragment_to_eventListFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.profileFragment) {
                findNavController(fragment!!).navigate(R.id.action_profileFragment_to_eventListFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.searchFragment) {
                findNavController(fragment!!).popBackStack()
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_listCurrentFragment_to_eventListFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listArticleFragment) {
                findNavController(fragment!!).navigate(R.id.action_listArticleFragment_to_eventListFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                findNavController(fragment!!).navigate(R.id.action_articleDetail_to_eventListFragment)
            }
        } else if (index == 1) {
            if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                val recyclerView =
                    fragment!!.view!!.findViewById<RecyclerView>(R.id.recyclerViewcurrent)
                recyclerView.smoothScrollToPosition(0)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                findNavController(fragment!!).navigate(R.id.action_eventListFragment_to_listCurrentFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_eventListFragment_to_listCurrentFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.profileFragment) {
                findNavController(fragment!!).navigate(R.id.action_profileFragment_to_listCurrentFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.searchFragment) {
                findNavController(fragment!!).navigate(R.id.action_searchFragment_to_listCurrentFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listArticleFragment) {
                findNavController(fragment!!).navigate(R.id.action_listArticleFragment_to_listCurrentFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                findNavController(fragment!!).navigate(R.id.action_articleDetail_to_listCurrentFragment)
            }
        } else if (index == 2) {
            if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                findNavController(fragment!!).navigate(R.id.action_listCurrentFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                findNavController(fragment!!).navigate(R.id.action_eventListFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_eventListFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.profileFragment) {
                findNavController(fragment!!).navigate(R.id.action_profileFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_listCurrentFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listArticleFragment) {
                findNavController(fragment!!).navigate(R.id.action_listArticleFragment_to_searchFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                findNavController(fragment!!).navigate(R.id.action_articleDetail_to_searchFragment)
            }
        } else if (index == 4) {
            val id = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
                .getString("userId", "defaultId")
            if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                val act = ListEventFragmentDirections.actionEventListFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                val act =
                    ListCurrentFragmentDirections.actionListCurrentFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
                val act = ListEventFragmentDirections.actionEventListFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.searchFragment) {
                val act = SearchFragmentDirections.actionSearchFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
                val act =
                    ListCurrentFragmentDirections.actionListCurrentFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listArticleFragment) {
                val act =
                    ListArticleFragmentDirections.actionListArticleFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                val act =
                    ArticleDetailDirections.actionArticleDetailToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            }
        } else if (index == 3) {
            val id = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
                .getString("userId", "defaultId")
            if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                val act = ListEventFragmentDirections.actionEventListFragmentToListArticleFragment()
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                val act =
                    ListCurrentFragmentDirections.actionListCurrentFragmentToListArticleFragment()
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_eventListFragment_to_listArticleFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.profileFragment) {
                findNavController(fragment!!).navigate(R.id.action_profileFragment_to_listArticleFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.searchFragment) {
                findNavController(fragment!!).navigate(R.id.action_searchFragment_to_listArticleFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
                findNavController(fragment!!).navigate(R.id.action_listCurrentFragment_to_listArticleFragment)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                findNavController(fragment!!).navigate(R.id.action_articleDetail_to_eventListFragment)
            }
        } else if(index == 5){
            val id = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
                .getString("userId", "defaultId")
            if (findNavController(fragment!!).currentDestination!!.id == R.id.eventListFragment) {
                val act = ListEventFragmentDirections.actionEventListFragmentToPortfolioFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listCurrentFragment) {
                val act =
                    ListCurrentFragmentDirections.actionListCurrentFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.eventFragment) {
                findNavController(fragment!!).popBackStack()
                val act = ListEventFragmentDirections.actionEventListFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.searchFragment) {
                val act = SearchFragmentDirections.actionSearchFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.currencyFragment) {
                findNavController(fragment!!).popBackStack()
                val act =
                    ListCurrentFragmentDirections.actionListCurrentFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.listArticleFragment) {
                val act =
                    ListArticleFragmentDirections.actionListArticleFragmentToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            } else if (findNavController(fragment!!).currentDestination!!.id == R.id.articleDetail) {
                val act =
                    ArticleDetailDirections.actionArticleDetailToProfileFragment(id!!)
                findNavController(fragment!!).navigate(act)
            }
        } else if (index == 6) {
            signOutPressed()
        }

    }
}

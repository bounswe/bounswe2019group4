package com.example.arken.fragment.search

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.inputmethod.InputMethodManager
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.util.CurrencyAdapter
import com.example.arken.util.OnCurrentClickListener
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchTE : Fragment(), OnCurrentClickListener {

    private lateinit var recyclerView: RecyclerView
    private var currencyAdapter: CurrencyAdapter? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_currency_list, container, false)

        recyclerView = rootView.findViewById(R.id.currency_recyclerView)

        if (currencyAdapter == null) {
            currencyAdapter = CurrencyAdapter(mutableListOf(), this)
        }

        recyclerView.adapter = currencyAdapter

        recyclerView.adapter?.notifyDataSetChanged()
        return rootView
    }

    override fun onItemClicked(code: String) {
        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")


        val act = SearchFragmentDirections.actionSearchFragmentToCurrencyFragment(code!!)
        findNavController().navigate(act)

    }

    fun setDataset(list: MutableList<Current>) {

        if (currencyAdapter == null) {
            currencyAdapter = CurrencyAdapter(mutableListOf(), this)
        }
        currencyAdapter!!.dataSet = list
        currencyAdapter!!.notifyDataSetChanged()
    }
    fun View.hideKeyboard() {
        val imm = context.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(windowToken, 0)
    }
}
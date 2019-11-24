package com.example.arken.fragment.search

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.CurrencyFragment
import com.example.arken.fragment.ListCurrentFragment
import com.example.arken.fragment.LoginFragment
import com.example.arken.model.tradingEquipment.Currency
import com.example.arken.model.tradingEquipment.Current
import com.example.arken.model.tradingEquipment.CurrencyValue
import com.example.arken.model.tradingEquipment.ListCurrency
import com.example.arken.model.tradingEquipment.Id
import com.example.arken.viewModel.TradingEquipmentViewModel
import com.example.arken.viewModel.StockDataEntry
import com.example.arken.util.CurrencyAdapter
import com.example.arken.util.CurrencyValueAdapter
import com.example.arken.util.RetroClient
import com.example.arken.util.UserAdapter
import com.example.arken.util.OnCurrentClickListener
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchTE: Fragment(), OnCurrentClickListener {

    private lateinit var recyclerView: RecyclerView
    private lateinit var currencyAdapter: CurrencyAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_currency_list, container, false)

        recyclerView = rootView.findViewById(R.id.currency_recyclerView)

        currencyAdapter = CurrencyAdapter(mutableListOf(), this)
        recyclerView.adapter = currencyAdapter

        recyclerView.adapter?.notifyDataSetChanged()
        return rootView
    }

    override fun onItemClicked(code: String) {
        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")

        val call: Call<Currency> = RetroClient.getInstance().apiService.getCurrency(userCookie,code)

        call.enqueue(object : Callback<Currency> {
            override fun onResponse(call: Call<Currency>, response: Response<Currency>) {
                if (response.isSuccessful) {


                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Currency>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
    fun setDataset(list: MutableList<Current>){
        currencyAdapter.dataSet = list
        currencyAdapter.notifyDataSetChanged()
    }
}
package com.example.arken.fragment

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.investment.Investment
import com.example.arken.model.investment.ListOrder
import com.example.arken.model.investment.Order
import com.example.arken.model.investment.TransactionHistory
import com.example.arken.util.OnOrderClickedListener
import com.example.arken.util.OrderAdapter
import com.example.arken.util.RetroClient
import com.example.arken.util.TransactionAdapter
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class InvestmentFragment : Fragment(), OnOrderClickedListener {

    private lateinit var orderRecyclerView: RecyclerView
    private var orderDataset: MutableList<Order> = mutableListOf()
    private lateinit var orderAdapter: OrderAdapter
    private lateinit var transactionRecyclerView: RecyclerView
    private var transactionDataset: MutableList<TransactionHistory> = mutableListOf()
    private lateinit var transactionAdapter: TransactionAdapter
    private lateinit var investment: Investment

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_myinvestments,
            container, false
        )

        orderRecyclerView = rootView.findViewById(R.id.fragment_investment_order_recyclerview)
        transactionRecyclerView =
            rootView.findViewById(R.id.fragment_investment_transaction_recyclerview)

        orderAdapter = OrderAdapter(this)
        orderAdapter.dataSet = orderDataset
        orderRecyclerView.adapter = orderAdapter

        transactionAdapter = TransactionAdapter()
        transactionAdapter.dataSet = transactionDataset
        transactionRecyclerView.adapter = transactionAdapter

        initDataset()
        orderRecyclerView.adapter?.notifyDataSetChanged()


        return rootView
    }

    override fun onClicked(orderId: String, position: Int) {
        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        )
            .getString("user_cookie", "")
        val call: Call<ResponseBody> =
            RetroClient.getInstance().apiService.deleteOrder(userCookie, orderId)

        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(
                call: Call<ResponseBody>,
                response: Response<ResponseBody>
            ) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Your order is deleted", Toast.LENGTH_SHORT)
                        .show()
                    orderDataset.removeAt(position)
                    orderAdapter.dataSet = orderDataset
                    orderAdapter.notifyDataSetChanged()

                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun initDataset() {
        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        )
            .getString("user_cookie", "")
        val call: Call<Investment> = RetroClient.getInstance().apiService.getInvestment(userCookie)
        call.enqueue(object : Callback<Investment> {
            override fun onResponse(call: Call<Investment>, response: Response<Investment>) {
                if (response.isSuccessful) {
                    investment = response.body()!!
                    transactionDataset=investment.histories
                    transactionAdapter.dataSet = transactionDataset
                    transactionAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Investment>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
        val call2: Call<ListOrder> = RetroClient.getInstance().apiService.getOrder(userCookie)
        call2.enqueue(object : Callback<ListOrder> {
            override fun onResponse(call: Call<ListOrder>, response: Response<ListOrder>) {
                if (response.isSuccessful) {
                    val listOrder = response.body()!!
                    orderDataset=listOrder.orders as MutableList<Order>
                    orderAdapter.dataSet = orderDataset
                    orderAdapter.notifyDataSetChanged()
                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ListOrder>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
}
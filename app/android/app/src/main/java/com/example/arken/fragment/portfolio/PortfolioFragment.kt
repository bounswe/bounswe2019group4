package com.example.arken.fragment.portfolio

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Portfolio
import com.example.arken.model.Profile
import com.example.arken.util.PortfolioAdapter
import com.example.arken.util.PortfolioListener
import com.example.arken.util.RetroClient
import com.google.android.material.floatingactionbutton.FloatingActionButton
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PortfolioFragment : Fragment(), PortfolioListener, PortfolioAddDialog.PortfolioAddListener{

    private lateinit var recyclerView: RecyclerView
    private var dataset: MutableList<Portfolio> = mutableListOf()
    private lateinit var portfolioAdapter: PortfolioAdapter
    private lateinit var addFloatingButton:FloatingActionButton
    private lateinit var dialog: PortfolioAddDialog

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_portfolio,
            container, false
        )

        recyclerView = rootView.findViewById(R.id.portfolios_recyclerView)
        val userId = activity!!.getSharedPreferences(
            MY_PREFS_NAME, MODE_PRIVATE
        ).getString("userId", "defaultId")!!

        portfolioAdapter = PortfolioAdapter(dataset, this)
        recyclerView.adapter = portfolioAdapter

        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()

        addFloatingButton = rootView.findViewById(R.id.portfolio_add)
        addFloatingButton.setOnClickListener{
            dialog = PortfolioAddDialog(this, context!!)
            dialog.show(fragmentManager!!, "portFragment")
        }

        return rootView
    }


    fun initDataset() {
        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("user_cookie", "")
        val realId = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("userId", "defaultId")

        val call: Call<Profile> =
            RetroClient.getInstance().apiService.getProfile(userCookie, realId)

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    val profile = response.body()!!
                    if(profile.portfolios== null){
                        dataset = mutableListOf()
                    }
                    else{
                        dataset = profile.portfolios!!
                    }
                    portfolioAdapter.dataSet = dataset
                    portfolioAdapter.notifyDataSetChanged()

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

    }

    override fun onPortfolioDeleted(position: Int) {
        Toast.makeText(context, "Delete portfolio", Toast.LENGTH_SHORT).show()
    }

    override fun onPortfolioEdited(position: Int) {
       Toast.makeText(context, "Portfolio edit", Toast.LENGTH_SHORT).show()
    }

    override fun onDialogPositiveClick() {
        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()
    }

}




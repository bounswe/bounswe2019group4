package com.example.arken.fragment.portfolio

import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.profile.ProfileFragmentArgs
import com.example.arken.fragment.signup_login.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Portfolio
import com.example.arken.model.Profile
import com.example.arken.util.PortfolioAdapter
import com.example.arken.util.PortfolioListener
import com.example.arken.util.RetroClient
import com.example.arken.util.TEClickListener
import com.google.android.material.floatingactionbutton.FloatingActionButton
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class PortfolioFragment : Fragment(), PortfolioListener, PortfolioAddDialog.PortfolioAddListener{

    private lateinit var recyclerView: RecyclerView
    private var dataset: MutableList<Portfolio> = mutableListOf()
    private lateinit var portfolioAdapter: PortfolioAdapter
    private lateinit var addFloatingButton:FloatingActionButton
    private lateinit var dialog: PortfolioAddDialog
    private lateinit var userCookie:String
    private lateinit var realId:String
    private val args: PortfolioFragmentArgs by navArgs()
    private var myPage = true
    private var userId:String = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(
            R.layout.fragment_portfolio,
            container, false
        )
        userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("user_cookie", "")!!

        userId = args.userId
        realId = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("userId", "defaultId")!!
        recyclerView = rootView.findViewById(R.id.portfolios_recyclerView)
        myPage = (realId == userId)
        val prefs = getActivity()!!.getSharedPreferences("MyPrefsFile", Context.MODE_PRIVATE)

        portfolioAdapter = PortfolioAdapter(dataset, this, myPage, prefs)
        recyclerView.adapter = portfolioAdapter

        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()

        addFloatingButton = rootView.findViewById(R.id.portfolio_add)
        addFloatingButton.setOnClickListener{
            dialog = PortfolioAddDialog(this, context!! , null)
            dialog.show(fragmentManager!!, "portFragment")
        }


        return rootView
    }


    fun initDataset() {

        val call: Call<Profile> =
            RetroClient.getInstance().apiService.getProfile(userCookie, userId)

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
                    Log.i("portErr" , response.raw().toString())
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                Log.i("portErr2" , t.message)

            }
        })

    }

    override fun onPortfolioDeleted(position: Int) {
        val call: Call<ResponseBody> =
            RetroClient.getInstance().apiService.deletePortfolio(userCookie, dataset[position]._id)

        call.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Your portfolio is deleted ", Toast.LENGTH_SHORT).show()

                   initDataset()

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun onPortfolioEdited(position: Int) {
        dialog = PortfolioAddDialog(this, context!! , dataset[position])
        dialog.show(fragmentManager!!, "portFragment")
    }

    override fun onDialogPositiveClick() {
        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()
    }
    override fun onPortfolioFollowed(position: Int, following: Boolean) {
        if(!following){
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.followPortfolio(userCookie, dataset[position]._id)

            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "Following portfolio", Toast.LENGTH_SHORT).show()

                        initDataset()

                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }
        else{
            val call: Call<ResponseBody> =
                RetroClient.getInstance().apiService.unfollowPortfolio(userCookie, dataset[position]._id)

            call.enqueue(object : Callback<ResponseBody> {
                override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                    if (response.isSuccessful) {
                        Toast.makeText(context, "Unfollowing portfolio ", Toast.LENGTH_SHORT).show()

                        initDataset()

                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                }
            })
        }

    }

}




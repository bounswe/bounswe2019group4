package com.example.arken.fragment.portfolio

import android.annotation.SuppressLint
import android.content.Context.MODE_PRIVATE
import android.os.AsyncTask
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.FollowingPortfolio
import com.example.arken.model.Portfolio
import com.example.arken.model.Profile
import com.example.arken.util.PortfolioAdapter
import com.example.arken.util.PortfolioListener
import com.example.arken.util.RetroClient
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
    private var userId:String = ""
    private lateinit var followingButton: Button
    var following = false
    private var followingList: MutableList<String>? = null

    @SuppressLint("RestrictedApi")
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

        val i = getIndex()
        portfolioAdapter = PortfolioAdapter(dataset, this, i, null, context!!)
        recyclerView.adapter = portfolioAdapter

        initDataset()
        recyclerView.adapter?.notifyDataSetChanged()

        addFloatingButton = rootView.findViewById(R.id.portfolio_add)
        addFloatingButton.setOnClickListener{
            dialog = PortfolioAddDialog(this, context!! , null)
            dialog.show(fragmentManager!!, "portFragment")
        }
        followingButton = rootView.findViewById(R.id.following_portfolio_button)
        followingButton.setOnClickListener{
            following = !following
            if(following){
                followingButton.text = "YOURS"
            }
            else{
                followingButton.text = "FOLLOWING"
            }
            initDataset()
            val i = getIndex()
            portfolioAdapter.mode = i
            (recyclerView.adapter as PortfolioAdapter).notifyDataSetChanged()

            if(i == 1){
                addFloatingButton.visibility = View.GONE
            }
            else if (i == 0){
                addFloatingButton.visibility = View.VISIBLE

            }
        }
        if(i== 2){
            followingButton.visibility = View.GONE
            addFloatingButton.visibility = View.GONE
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
                    if(following){
                        dataset.clear()
                        if(profile.followingPortfolios!= null){
                            val arr = profile.followingPortfolios
                            followingList = mutableListOf()
                            for(port in arr) {
                                followingList!!.add(port.PortfolioId)
                            }
                            for(port in arr){
                                val getP = GetPortfolio()
                                getP.port = port
                                getP.userCookie = userCookie
                                var port2 = getP.execute().get()
                                if(port2!= null){
                                    dataset.add(port2)
                                }
                            }
                        }
                        else{
                            dataset = mutableListOf()
                        }
                    }else{
                        if(profile.portfolios== null){
                            dataset = mutableListOf()
                        }
                        else{
                            dataset = profile.portfolios!!
                        }
                    }
                    if(followingList== null || followingList!!.size==0){
                        val followAsync = GetFollowingList()
                        followAsync.userCookie = userCookie
                        followAsync.userId = realId
                        followingList = followAsync.execute().get()
                    }

                    portfolioAdapter.dataSet = dataset
                    portfolioAdapter.followingPortfolioIds = followingList
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
                        recyclerView.adapter?.notifyDataSetChanged()

                    } else {
                        Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                        Log.i("followerr", response.raw().toString())
                    }
                }

                override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                    Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                    Log.i("followerr2", t.message)
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
                        recyclerView.adapter?.notifyDataSetChanged()

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


    fun getIndex():Int{
        val i:Int = if(realId == userId){
            if(!following){
                0
            } else{
                1
            }
        } else{
            2
        }
        return i
    }


    class GetPortfolio : AsyncTask<FollowingPortfolio, Void, Portfolio>() {
        var port: FollowingPortfolio? = null
        var userCookie:String? = null
        override fun doInBackground(vararg params: FollowingPortfolio?): Portfolio? {
            val callPort: Call<com.example.arken.model.GetPortfolio> =
                RetroClient.getInstance().apiService.getPortfolio(userCookie, port?.PortfolioId)
            var p: Portfolio?  =null

            callPort.enqueue(object : Callback<com.example.arken.model.GetPortfolio> {
                override fun onResponse(call: Call<com.example.arken.model.GetPortfolio>, response: Response<com.example.arken.model.GetPortfolio>) {
                    if (response.isSuccessful) {
                        p = response.body()!!.portfolio
                        p?.username = port?.userName
                        p?.surname = port?.userSurname
                        p?.tradingEqs = response.body()!!.tradingEqs

                    } else {
                        Log.i("getPort", "err")
                    }
                }

                override fun onFailure(call: Call<com.example.arken.model.GetPortfolio>, t: Throwable) {
                    Log.i("getPort", "err")
                }
            })
            return p
        }

    }

    class GetFollowingList : AsyncTask<FollowingPortfolio, Void, MutableList<String>>() {
        var userId: String? = null
        var userCookie:String? = null
        override fun doInBackground(vararg params: FollowingPortfolio?): MutableList<String>? {
            val call: Call<Profile> =
                RetroClient.getInstance().apiService.getProfile(userCookie, userId)
            val arr = mutableListOf<String>()
            call.enqueue(object : Callback<Profile> {
                override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                    if (response.isSuccessful) {

                        val follow = response.body()?.followingPortfolios
                        if (follow != null) {
                            for( i in follow){
                                arr.add(i.PortfolioId)
                            }
                        }

                    }
                }

                override fun onFailure(call: Call<Profile>, t: Throwable) {
                }
            })
            return arr
        }

    }

}




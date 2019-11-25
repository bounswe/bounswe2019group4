package com.example.arken.fragment.search

import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.NavHostFragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.CommentFragment
import com.example.arken.fragment.ListCommentFragment
import com.example.arken.fragment.LoginFragment
import com.example.arken.fragment.ProfileFragment
import com.example.arken.model.Comment
import com.example.arken.model.Event
import com.example.arken.model.Profile
import com.example.arken.model.User
import com.example.arken.util.CommentAdapter
import com.example.arken.util.OnUserClickedListener
import com.example.arken.util.RetroClient
import com.example.arken.util.UserAdapter
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SearchUser(var onBackPressed: OnBackPressed): Fragment(), OnUserClickedListener {
    private lateinit var recyclerView: RecyclerView
    private var userAdapter: UserAdapter? = null
    private var openProf = false
    private var profFragment:ProfileFragment? = null

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        val rootView = inflater.inflate(R.layout.fragment_user_list, container, false)

        recyclerView = rootView.findViewById(R.id.user_recyclerView)
        if (userAdapter == null) {
            userAdapter = UserAdapter(mutableListOf(), this)
        }
        recyclerView.adapter = userAdapter

        recyclerView.adapter?.notifyDataSetChanged()

        val callback = object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if(openProf && profFragment!=null){
                    openProf = false
                    fragmentManager?.beginTransaction()?.remove(profFragment!!)?.commit()
                }
                else{
                    onBackPressed.onBackPressed()
                }
            }
        }
        requireActivity().onBackPressedDispatcher.addCallback(this, callback)
        return rootView
    }

    override fun onItemClicked(userId: String) {
        val userCookie = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")

        val call: Call<Profile> =
            RetroClient.getInstance().apiService.getProfile(userCookie, userId)

            call.enqueue(object : Callback<Profile> {
                override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                    if (response.isSuccessful) {
                        profFragment = ProfileFragment(response.body()?.user?._id)
                        fragmentManager?.beginTransaction()?.add(R.id.search_container, profFragment!!, "prof")?.commit()
                        openProf = true

                } else {
                    Toast.makeText(context, response.message(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    fun setDataset(list: MutableList<User>) {
        if (userAdapter == null) {
            userAdapter = UserAdapter(mutableListOf(), this)
        }
        userAdapter!!.dataSet = list
        userAdapter!!.notifyDataSetChanged()
    }

    interface OnBackPressed{
        fun onBackPressed()
    }
}
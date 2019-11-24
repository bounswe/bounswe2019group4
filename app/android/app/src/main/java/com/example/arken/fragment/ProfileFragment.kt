package com.example.arken.fragment


import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.fragment.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.FollowRequest
import com.example.arken.model.Profile
import com.example.arken.util.OnRequestClickedListener
import com.example.arken.util.RetroClient
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileFragment( var userId: String?) : Fragment(), OnRequestClickedListener {
    constructor() : this(null)

    private lateinit var name_textView: TextView
    private lateinit var surname_textView: TextView
    private lateinit var location_value_textView: TextView
    private lateinit var user_type_textView: TextView
    private lateinit var email_value_textView: TextView
    private lateinit var pred_value_textView: TextView
    private lateinit var profile: Profile
    private lateinit var followButton: TextView
    private lateinit var followingCountText: TextView
    private lateinit var followerCountText: TextView
    private var followerCount = 0
    private var isPublic = true
    private val args: ProfileFragmentArgs by navArgs()
    private var following = false
    private lateinit var pendingReqText:TextView
    var userCookie =""
    private var pendingReqList:MutableList<FollowRequest> = mutableListOf()
    private var followerList:MutableList<FollowRequest> = mutableListOf()
    private var followingList:MutableList<FollowRequest> = mutableListOf()
    private lateinit var dialog:PendingUserDialog

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val view = inflater.inflate(R.layout.fragment_profile, container, false)

        name_textView = view.findViewById(R.id.name_textView)
        surname_textView = view.findViewById(R.id.surname_textView)
        user_type_textView = view.findViewById(R.id.user_type_textView)
        location_value_textView = view.findViewById(R.id.location_value_textView)
        email_value_textView = view.findViewById(R.id.email_value_textView)
        pred_value_textView = view.findViewById(R.id.pred_value_textView)
        followButton = view.findViewById(R.id.user_follow)
        followerCountText = view.findViewById(R.id.follower_value_textView)
        followingCountText = view.findViewById(R.id.following_value_textView)
        pendingReqText = view.findViewById(R.id.profile_pending_req)

        if(userId == null){
            userId = args.userId
        }
        getProfile()

        followButton.setOnClickListener{
            userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("user_cookie", "")!!
            if(!following){
                val callFollow: Call<ResponseBody> = RetroClient.getInstance().apiService.follow(userCookie, userId)

                callFollow.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        if (response.isSuccessful) {

                            if(isPublic){

                                getProfile()
                                followButton.text = "UNFOLLOW"
                                following = true
                                Toast.makeText(context, "You are following", Toast.LENGTH_SHORT).show()
                            }
                            else{
                                followButton.text = "PENDING"
                                Toast.makeText(context, "Your request is sent", Toast.LENGTH_SHORT).show()
                            }

                        } else {
                            Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                .show()
                        }
                    }

                    override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                    }
                })
            }
            else{
                if(followButton.text == "PENDING"){
                    Toast.makeText(context, "Your request is already sent", Toast.LENGTH_SHORT).show()
                }
                else{
                    if(!following){
                        followButton.text = "Follow"
                    }else{
                        val callFollow: Call<ResponseBody> = RetroClient.getInstance().apiService.unfollow(userCookie, userId)

                        callFollow.enqueue(object : Callback<ResponseBody> {
                            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                                if (response.isSuccessful) {
                                    Toast.makeText(context, "You have unfollowed", Toast.LENGTH_SHORT).show()

                                    getProfile()

                                } else {
                                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                        .show()
                                }
                            }

                            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                            }
                        })
                    }
                }


            }

        }
        followerCountText.setOnClickListener{
            if(followerList.size>0){
                dialog = PendingUserDialog(followerList, this, 1)
                dialog.show(fragmentManager!!, "PioneersFragment_tag")
            }
        }
        followingCountText.setOnClickListener{
            if(followingList.size>0){
                dialog = PendingUserDialog(followingList, this, 2)
                dialog.show(fragmentManager!!, "PioneersFragment_tag")
            }
        }

        pendingReqText.setOnClickListener{
            if(pendingReqList.size>0){
                dialog = PendingUserDialog(pendingReqList, this, 0)
                dialog.show(fragmentManager!!, "PioneersFragment_tag")
            }
        }


        return view
    }

    override fun onItemClicked(userId: String, position: Int) {

    }

    override fun onAcceptClicked(followingId: String, position: Int) {
        //call
        userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("user_cookie", "")!!
        val callAccept: Call<ResponseBody> = RetroClient.getInstance().apiService.accept(userCookie, followingId)

        callAccept.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Accepted", Toast.LENGTH_SHORT).show()
                    getProfile()
                    dialog.removeAt(position)

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                    Log.i("erroronprof ", response.raw().toString())
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

    override fun onRejectClicked(followingId: String, position: Int) {
        //call
        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("user_cookie", "")
        val callAccept: Call<ResponseBody> = RetroClient.getInstance().apiService.reject(userCookie, followingId)

        callAccept.enqueue(object : Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                if (response.isSuccessful) {
                    Toast.makeText(context, "Rejected", Toast.LENGTH_SHORT).show()
                    dialog.removeAt(position)

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                        .show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
    fun getProfile(){
        val realId = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("userId", "defaultId")

        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("user_cookie", "")
        val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(userCookie, userId)

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    profile = response.body()!!

                    name_textView.text = profile.user?.name
                    surname_textView.text = profile.user?.surname
                    followerCountText.text = "" + profile.follower
                    followingCountText.text = "" + profile.following
                    followerCount = profile.follower!!
                    if((userCookie!= "" && realId == userId) || profile.user?.isPublic!! || profile.followStatus=="TRUE"){
                        user_type_textView.text = if (profile.user?.isTrader!!) {"Trader"} else {"Basic"}
                        location_value_textView.text = profile.user?.location
                        email_value_textView.text = profile.user?.email
                        followingList = profile.followings!!
                        followerList = profile.followers!!
                    }else{
                        user_type_textView.visibility = View.GONE
                        location_value_textView.visibility = View.GONE
                        email_value_textView.visibility =View.GONE
                    }

                    isPublic = profile.user?.isPublic!!
                    if(userCookie!= "" && realId != userId){
                        followButton.visibility = View.VISIBLE
                        if(profile.followStatus=="TRUE"){
                            followButton.text = "UNFOLLOW"
                            following = true
                        }else{
                            followButton.text = "FOLLOW"
                            following = false
                        }
                    }
                    else if(userCookie!=""){
                        pendingReqText.visibility = View.VISIBLE
                        pendingReqText.text = "Pending Requests: " + profile.followRequest
                        pendingReqList = profile.followRequests
                    }

                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }

}
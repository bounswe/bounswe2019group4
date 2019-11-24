package com.example.arken.fragment


import android.Manifest
import android.app.Activity
import android.content.Context
import android.content.Context.MODE_PRIVATE
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat.checkSelfPermission
import androidx.core.net.toUri
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.example.arken.R
import com.example.arken.activity.MainActivity.IMAGE_PREF
import com.example.arken.fragment.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Profile
import com.example.arken.model.User
import com.example.arken.util.RetroClient
import de.hdodenhof.circleimageview.CircleImageView
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileFragment( var userId: String?) : Fragment() {
    constructor() : this(null)

    private lateinit var name_textView: TextView
    private lateinit var surname_textView: TextView
    private lateinit var location_value_textView: TextView
    private lateinit var user_type_textView: TextView
    private lateinit var profile_image: CircleImageView
    private lateinit var profile_button: ImageButton
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
    private var pendingReqList:MutableList<User> = mutableListOf()

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
        val realId = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("userId", "defaultId")

        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).getString("user_cookie", "")
        val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(userCookie, userId)

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    profile = response.body()!!

                    name_textView.text = profile.user?.name
                    surname_textView.text = profile.user?.surname
                    if((userCookie!= "" && realId == userId) || profile.user?.isPublic!!){
                        user_type_textView.text = if (profile.user?.isTrader!!) {"Trader"} else {"Basic"}
                        location_value_textView.text = profile.user?.location
                        email_value_textView.text = profile.user?.email
                        followerCountText.text = "" + profile.follower
                        followingCountText.text = "" + profile.following
                        followerCount = profile.follower!!
                    }

                    isPublic = profile.user?.isPublic!!
                    if(userCookie!= "" && realId != userId){
                        followButton.visibility = View.VISIBLE
                        if(profile.followStatus!!){
                            followButton.text = "UNFOLLOW"
                            following = true
                        }else{
                            followButton.text = "FOLLOW"
                            following = false
                        }
                    }
                    else{
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

        followButton.setOnClickListener{
            if(!following){
                val callFollow: Call<ResponseBody> = RetroClient.getInstance().apiService.follow(userCookie, userId)

                callFollow.enqueue(object : Callback<ResponseBody> {
                    override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                        if (response.isSuccessful) {
                            Toast.makeText(context, "You are following", Toast.LENGTH_SHORT).show()
                            if(isPublic){
                                followerCountText.text = "" + (followerCount + 1)
                                followerCount += 1
                                followButton.text = "UNFOLLOW"
                                following = true
                            }
                            else{
                                followButton.text = "PENDING"
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
                if(!following){
                    followButton.text = "Follow"
                }else{
                    val callFollow: Call<ResponseBody> = RetroClient.getInstance().apiService.unfollow(userCookie, userId)

                    callFollow.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                Toast.makeText(context, "You have unfollowed", Toast.LENGTH_SHORT).show()
                                followerCountText.text = "" + (followerCount - 1)
                                followerCount -= 1
                                followButton.text = "Follow"
                                following = false

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

        pendingReqText.setOnClickListener{
            Toast.makeText(context, "pending req size "+ pendingReqList.size, Toast.LENGTH_SHORT).show()
        }

        return view
    }
}
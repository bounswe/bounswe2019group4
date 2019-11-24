package com.example.arken.fragment


import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.activity.MainActivity.IMAGE_PREF
import com.example.arken.fragment.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Profile
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileFragment : Fragment() {

    private lateinit var name_textView: TextView
    private lateinit var surname_textView: TextView
    private lateinit var location_value_textView: TextView
    private lateinit var user_type_textView: TextView
    private lateinit var email_value_textView: TextView
    private lateinit var pred_value_textView: TextView
    private lateinit var profile: Profile
    private lateinit var logOut: Button

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
        val id = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        )
            .getString("userId", "defaultId")
        val userCookie = activity!!.getSharedPreferences(MY_PREFS_NAME, Context.MODE_PRIVATE).getString("user_cookie", "")
       val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(userCookie, id)

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    profile = response.body()!!

                    name_textView.text = profile.user?.name
                    surname_textView.text = profile.user?.surname
                    user_type_textView.text = if (profile.user?.isTrader!!) {"Trader"} else {"Basic"}
                    location_value_textView.text = profile.user?.location
                    email_value_textView.text = profile.user?.email


                } else {
                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<Profile>, t: Throwable) {
                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
            }
        })

        return view
    }



    fun setPreference(c: Context, value: String, key: String): Boolean {
        var settings = c.getSharedPreferences(IMAGE_PREF, 0)
        val editor = settings.edit()
        editor.putString(key, value)
        return editor.commit()
    }

    fun getPreference(c: Context, key: String): String {
        var settings = c.getSharedPreferences(IMAGE_PREF, 0)
        return settings.getString(key, "")!!
    }

    companion object {

        private val IMAGE_PICK_CODE = 1000
        private val PERMISSION_CODE = 1001
    }

}
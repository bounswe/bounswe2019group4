package com.example.arken.fragment

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.arken.R
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
    private var profile: Profile? = null
    // private var profile: Profile? = null
    // val prefs: SharedPreferences? = activity!!.getSharedPreferences(MY_PREFS_NAME!!, MODE_PRIVATE)


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        getProfileInfo()
    }

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

        name_textView.text = profile?.name
        surname_textView.text = profile?.surname
        //user_type_textView.text = if (profile?.isTrader!!) {"Trader User"} else {"Basic User"}
        location_value_textView.text = profile?.location
        email_value_textView.text = profile?.email


        return view
    }

    private fun getProfileInfo() {

        val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        )
            .getString("userId", "defaultId"))

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    this@ProfileFragment.profile = response.body()!!

                    //val profileName: String? = profile!!.name!!

                    //name_textView.text = profileName

                    //Toast.makeText(context, profileName, Toast.LENGTH_SHORT).show()
                    /*
                    name_textView = view.findViewById(R.id.name_textView)
                    surname_textView = view.findViewById(R.id.surname_textView)
                    user_type_textView = view.findViewById(R.id.user_type_textView)
                    location_value_textView = view.findViewById(R.id.location_value_textView)
                    email_value_textView = view.findViewById(R.id.email_value_textView)

                    name_textView.text = profile!!.name
                    surname_textView.text = profile!!.surname
                    user_type_textView.text = if (profile!!.isTrader!!) {"Trader User"} else {"Basic User"}
                    location_value_textView.text = profile!!.location
                    email_value_textView.text = profile!!.email
                    */


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
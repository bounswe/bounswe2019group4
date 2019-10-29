package com.example.arken.fragment

import android.content.Context.MODE_PRIVATE
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.arken.R
import com.example.arken.fragment.LoginFragment.MY_PREFS_NAME
import com.example.arken.model.Profile
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class ProfileFragment : Fragment() {

    private lateinit var name_textView: TextView
   // val prefs: SharedPreferences? = activity!!.getSharedPreferences(MY_PREFS_NAME!!, MODE_PRIVATE)


    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val view = inflater.inflate(R.layout.fragment_profile, container, false)


        name_textView = view.findViewById(R.id.name_textView)


        val call: Call<Profile> = RetroClient.getInstance().apiService.getProfile(activity!!.getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE)
            .getString("userId", "defaultId"))

        call.enqueue(object : Callback<Profile> {
            override fun onResponse(call: Call<Profile>, response: Response<Profile>) {
                if (response.isSuccessful) {
                    val profile: Profile? = response.body()
                    val profileName: String? = profile!!.name!!

                   name_textView.text = profileName

                    Toast.makeText(context, profileName, Toast.LENGTH_SHORT).show()

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
}
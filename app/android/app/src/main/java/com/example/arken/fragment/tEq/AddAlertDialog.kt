package com.example.arken.fragment.tEq

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Switch
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import androidx.recyclerview.widget.RecyclerView
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.fragment.tEq.CurrencyFragment
import com.example.arken.model.Alert
import com.example.arken.model.FollowRequest
import com.example.arken.util.*
import com.google.android.material.floatingactionbutton.FloatingActionButton
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class AddAlertDialog(val addAlertListener: AddAlertListener, val currency: String, val currentVal: Double) : DialogFragment(){

    lateinit var editTextVal: EditText
    lateinit var switch: Switch
    lateinit var button: Button
    var userCookie = ""

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val rootView = inflater.inflate(R.layout.dialog_add_alert, container)
        editTextVal = rootView.findViewById(R.id.add_alert_edittext)
        switch = rootView.findViewById(R.id.alert_isHigher)
        button = rootView.findViewById(R.id.add_alert_button)
        var value = 0.0
        button.setOnClickListener{
            if(editTextVal.text.trim() ==""){
                editTextVal.error = "Please enter a value"
            }
            else {
                value = (editTextVal.text.toString().toDouble())
                if(value== currentVal){
                    Toast.makeText(context, "The value is already equal", Toast.LENGTH_SHORT).show()
                }
                if(value < currentVal && switch.isChecked){
                    Toast.makeText(context, "The value is already higher", Toast.LENGTH_SHORT).show()
                }
                else if(value > currentVal && !switch.isChecked){
                    Toast.makeText(context, "The value is already higher", Toast.LENGTH_SHORT).show()
                }
                else{
                    var txt = "lower"
                    if(switch.isChecked){
                        txt = "higher"
                    }
                    val callCreate: Call<ResponseBody> =
                        RetroClient.getInstance().apiService.createAlert(userCookie, Alert(null, currency, value, txt))

                    callCreate.enqueue(object : Callback<ResponseBody> {
                        override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                            if (response.isSuccessful) {
                                Toast.makeText(context, "You have added your alert", Toast.LENGTH_SHORT).show()
                                addAlertListener.onAddAlert()
                                dialog?.dismiss()
                            }
                        }

                        override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                        }
                    })
                }
            }

        }

        this.dialog?.setTitle("Add Alert")
        userCookie  = activity!!.getSharedPreferences(
            LoginFragment.MY_PREFS_NAME,
            Context.MODE_PRIVATE
        ).getString("user_cookie", "")!!

        return rootView
    }

}
interface AddAlertListener{
    fun onAddAlert()
}
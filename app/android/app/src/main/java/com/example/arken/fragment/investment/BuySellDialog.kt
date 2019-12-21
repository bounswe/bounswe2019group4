package com.example.arken.fragment.investment

import android.content.Context
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.example.arken.R
import com.example.arken.fragment.signup_login.LoginFragment
import com.example.arken.model.investment.Account
import com.example.arken.util.RetroClient
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.lang.Exception

class BuySellDialog (val onDepositClickListener: DepositClickListener): DialogFragment(){
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {

        val rootView: View = inflater.inflate(R.layout.fragment_deposit_dialog, container, false)

        var submit_button = rootView.findViewById<Button>(R.id.submit_deposit_button)
        var cancel_button = rootView.findViewById<Button>(R.id.cancel_deposit_button)

        var iban_editText = rootView.findViewById<EditText>(R.id.deposit_iban_editText)
        iban_editText.setText(ibanDefault)
        var amount_editText = rootView.findViewById<EditText>(R.id.amountEditText)

        cancel_button.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View?) {
                dismiss()
            }
        })

        submit_button.setOnClickListener(object : View.OnClickListener {
            override fun onClick(v: View?) {
                var iban: String
                var amount: Double
                iban=iban_editText.text.toString()
                if (amount_editText.text.isNotEmpty() ){
                    try {
                        amount=amount_editText.text.toString().toDouble()

                        val call: Call<Account> = RetroClient.getInstance().apiService.depositMoney(
                            activity!!.getSharedPreferences(
                                LoginFragment.MY_PREFS_NAME,
                                Context.MODE_PRIVATE
                            )
                                .getString("user_cookie", "defaultCookie")
                            , Deposit(iban =iban, amount =amount)
                        )



                        call.enqueue(object : Callback<Account> {
                            override fun onResponse(
                                call: Call<Account>,
                                response: Response<Account>
                            ) {
                                if (response.isSuccessful) {
                                    Toast.makeText(context, "Deposit Successful", Toast.LENGTH_SHORT).show()
                                    onDepositClickListener.onDepositClick()
                                    dismiss()

                                } else {
                                    Toast.makeText(context, response.raw().toString(), Toast.LENGTH_SHORT)
                                        .show()
                                }
                            }

                            override fun onFailure(call: Call<Account>, t: Throwable) {
                                Toast.makeText(context, t.message, Toast.LENGTH_SHORT).show()
                            }
                        })}catch (e: Exception){

                    }
                }


            }
        })



        return rootView
    }
}